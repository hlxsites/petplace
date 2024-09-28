import { useCallback, useState } from "react";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { CartItem, CommonCartItem } from "~/domain/models/cart/CartModel";
import getCartCheckoutFactory from "~/domain/useCases/cart/getCartCheckoutFactory";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import getProductsFactory from "~/domain/useCases/products/getProductsFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";

import { PET_ID_ROUTE_PARAM } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";

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

  const isService = (type: string): boolean => {
    return (
      type === "AnnualProduct" ||
      type === "LPMPLUSProduct" ||
      type === "LPMProduct"
    );
  };

  const selectedPlan = {
    petId,
    id: selectedPlanItem.id,
    name: selectedPlanItem.title,
    price: selectedPlanItem.price,
    quantity: 1,
    type: selectedPlanItem.type,
    isService: isService(selectedPlanItem.type),
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

  useDeepCompareEffect(() => {
    onUpdateCartMembership(selectedPlan);
  }, [currentCart, selectedPlan, onUpdateCartMembership]);

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

  return {
    cartItems,
    onUpdateCartProduct,
    products,
  };
};
