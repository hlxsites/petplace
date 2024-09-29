import { useCallback, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { CartItem, CommonCartItem } from "~/domain/models/cart/CartModel";
import getCartCheckoutFactory from "~/domain/useCases/cart/getCartCheckoutFactory";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import getProductsFactory from "~/domain/useCases/products/getProductsFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";

import { MembershipPlanId } from "~/domain/checkout/CheckoutModels";
import { PET_ID_ROUTE_PARAM } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { formatPrice, getValueFromPrice } from "~/util/stringUtil";
import { OPT_IN_LABEL } from "./utils/hardCodedRenewPlan";

export const loader = (async ({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get(PET_ID_ROUTE_PARAM);
  invariantResponse(petId, "petId param is required");

  const plan = url.searchParams.get("plan");
  invariantResponse(plan, "plan param is required");

  const authToken = requireAuthToken();

  const useCase = getCheckoutFactory(authToken);
  const checkoutData = await useCase.query(petId);

  const plans = checkoutData?.plans || [];
  const selectedPlanItem = plans.find((item) => item.id === plan);
  invariantResponse(selectedPlanItem, "plan is required");

  const isService = (id: MembershipPlanId): boolean => {
    return (
      id === "AnnualMembership" ||
      id === "LPMPlusMembership" ||
      id === "LPMMembership"
    );
  };

  const selectedPlan = {
    autoRenew: false,
    petId,
    id: selectedPlanItem.id,
    name: selectedPlanItem.title,
    price: selectedPlanItem.price,
    quantity: 1,
    type: selectedPlanItem.type,
    isService: isService(selectedPlanItem.hardCodedPlanId),
  };

  const productsUseCase = getProductsFactory(authToken);
  const productsData = await productsUseCase.query(petId, plan);

  const cartCheckoutUseCase = getCartCheckoutFactory(authToken);
  const postCart = cartCheckoutUseCase.post;
  const getCart = cartCheckoutUseCase.query;

  const currentCart = await getCart();

  return defer({
    currentCart,
    petId,
    postCart,
    products: productsData,
    selectedPlan,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { currentCart, petId, postCart, products, selectedPlan } =
    useLoaderData<typeof loader>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<string>("");
  // TODO: the initial state should be from get
  const [autoRenew, setAutoRenew] = useState<boolean>(selectedPlan.autoRenew);

  const [isOpenCart, setIsOpenCart] = useState(false);

  const onUpdateCartMembership = useCallback(
    (newMembership: CommonCartItem) => {
      setCartItems((prevState) => {
        const existingItem = prevState.find(
          (item) => item.id === newMembership.id
        );

        // The code uses stringify to compare the entire object for safety purposes
        if (
          existingItem &&
          JSON.stringify(existingItem) === JSON.stringify(newMembership)
        ) {
          return prevState;
        }

        // If the item is new or has changed, update the state
        const updatedState = existingItem
          ? prevState.map((item) =>
              item.id === newMembership.id ? newMembership : item
            )
          : [...prevState, newMembership];

        void postCart(updatedState, petId);
        return updatedState;
      });
    },
    [postCart, petId]
  );

  const onUpdateOptIn = useCallback(() => {
    setAutoRenew((prevAutoRenew) => {
      const newAutoRenew = !prevAutoRenew;

      setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems.map((item) =>
          item.id === selectedPlan.id
            ? { ...item, autoRenew: newAutoRenew }
            : item
        );

        void postCart(updatedCartItems, petId);
        return updatedCartItems;
      });

      return newAutoRenew;
    });
  }, [selectedPlan.id, petId, postCart]);

  useDeepCompareEffect(() => {
    onUpdateCartMembership(selectedPlan);
  }, [currentCart, selectedPlan, onUpdateCartMembership]);

  useDeepCompareEffect(() => {
    function calculateSubtotal(): number {
      return cartItems.reduce((total, item) => {
        if (!item.price) return 0;

        const itemPrice = getValueFromPrice(item.price.toString());
        const itemQuantity = item.quantity ?? 1;
        return total + itemPrice * itemQuantity;
      }, 0);
    }

    setSubtotal(formatPrice(calculateSubtotal()));
  }, [cartItems]);

  const onUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const onUpdateCartProduct = (product: CommonCartItem) => {
    setCartItems((prevState) => {
      let updatedState: CommonCartItem[] = [];
      // The product already exists in the cart
      const exist = prevState.find((item) => item.id === product.id);
      if (exist) {
        updatedState = prevState.map((item) => {
          if (item.id === product.id) return product;

          return item;
        });
      } else {
        updatedState = [...prevState, product];
      }

      void postCart(updatedState, petId);
      return updatedState;
    });
  };

  function getOptInLabel() {
    return OPT_IN_LABEL[selectedPlan.type] ?? OPT_IN_LABEL["default"];
  }

  function onCloseCart() {
    setIsOpenCart(false);
  }

  function onOpenCart() {
    setIsOpenCart(true);
  }

  return {
    autoRenew,
    cartItems,
    isOpenCart,
    optInLabel: getOptInLabel(),
    onCloseCart,
    onOpenCart,
    onUpdateCartProduct,
    onUpdateQuantity,
    onUpdateOptIn,
    products,
    subtotal,
  };
};

export const useCheckoutProductsViewModelContext = () =>
  useOutletContext<ReturnType<typeof useCheckoutProductsViewModel>>();
