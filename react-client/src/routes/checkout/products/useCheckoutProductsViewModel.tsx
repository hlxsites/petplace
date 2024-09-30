import { useCallback, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { CartItem } from "~/domain/models/cart/CartModel";
import getCartCheckoutFactory from "~/domain/useCases/cart/getCartCheckoutFactory";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import getProductsFactory from "~/domain/useCases/products/getProductsFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";

import { MembershipPlanId } from "~/domain/checkout/CheckoutModels";
import { REDIRECT_TO_CHECKOUT_URL } from "~/domain/useCases/checkout/utils/checkoutHardCodedData";
import {
  convertProductToCartItem,
  findProductBasedOnOptionId,
  getProductColorSizeBasedOnCartId,
} from "~/domain/util/checkoutProductUtil";
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
    ...selectedPlanItem,
    autoRenew: false,
    petId,
    quantity: 1,
    isService: isService(selectedPlanItem.hardCodedPlanId),
  };

  const productsUseCase = getProductsFactory(authToken);
  const productsData = (await productsUseCase.query(petId, plan)) || [];

  const cartCheckoutUseCase = getCartCheckoutFactory(authToken);
  const postCart = cartCheckoutUseCase.post;
  const getCart = cartCheckoutUseCase.query;

  const savedCart = await getCart();

  return defer({
    savedCart,
    petId,
    postCart,
    products: productsData,
    selectedPlan,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { savedCart, petId, postCart, products, selectedPlan } =
    useLoaderData<typeof loader>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // TODO: the initial state should be from get
  const [autoRenew, setAutoRenew] = useState<boolean>(selectedPlan.autoRenew);

  const [isOpenCart, setIsOpenCart] = useState(false);

  // const onUpdateCartMembership = useCallback(
  //   (newMembership: CommonCartItem) => {
  //     setCartItems((prevState) => {
  //       const existingItem = prevState.find(
  //         (item) => item.id === newMembership.id
  //       );

  //       // The code uses stringify to compare the entire object for safety purposes
  //       if (
  //         existingItem &&
  //         JSON.stringify(existingItem) === JSON.stringify(newMembership)
  //       ) {
  //         return prevState;
  //       }

  //       // If the item is new or has changed, update the state
  //       const updatedState = existingItem
  //         ? prevState.map((item) =>
  //             item.id === newMembership.id ? newMembership : item
  //           )
  //         : [...prevState, newMembership];

  //       void postCart(updatedState, petId);
  //       return updatedState;
  //     });
  //   },
  //   [postCart, petId]
  // );

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
    const manageInitialCartItems = () => {
      let didAddMembership = false;
      const initialCartItems: CartItem[] = [];

      savedCart.forEach((savedProduct) => {
        if (savedProduct.petId !== petId) return;

        // Handle membership plan
        if (selectedPlan.id === savedProduct.id) {
          didAddMembership = true;
          initialCartItems.push({
            ...selectedPlan,
            autoRenew: savedProduct.autoRenew,
          });
          return;
        }

        // Handle products
        const product = findProductBasedOnOptionId(savedProduct.id, products);
        if (!product) return;

        const selectedColorSize = getProductColorSizeBasedOnCartId(
          savedProduct.id,
          product
        );
        if (!selectedColorSize) return;

        const item = convertProductToCartItem(product, selectedColorSize);
        if (item)
          initialCartItems.push({ ...item, quantity: savedProduct.quantity });
      });

      if (!didAddMembership) {
        // We want to add the membership plan to the cart if it's not there yet
        initialCartItems.unshift(selectedPlan);
      }
      setCartItems(initialCartItems);
    };

    if (!cartItems.length && savedCart && products.length && selectedPlan) {
      manageInitialCartItems();
    }
  }, [cartItems.length, products, savedCart, selectedPlan]);

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

  const onUpdateCartProduct = (product: CartItem) => {
    setCartItems((prevState) => {
      let updatedState: CartItem[] = [];
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

  const onContinueToCheckoutPayment = () => {
    // TODO:  wait if there is a post request in progress

    window.location.href = REDIRECT_TO_CHECKOUT_URL;
  };

  const subtotal = (() => {
    const sum = cartItems.reduce((total, item) => {
      if (!item.price) return 0;

      const itemPrice = getValueFromPrice(item.price.toString());
      const itemQuantity = item.quantity ?? 1;
      return total + itemPrice * itemQuantity;
    }, 0);

    return formatPrice(sum);
  })();

  return {
    autoRenew,
    cartItems,
    isOpenCart,
    optInLabel: getOptInLabel(),
    onContinueToCheckoutPayment,
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
