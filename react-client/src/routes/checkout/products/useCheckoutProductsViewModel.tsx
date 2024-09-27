import { useState } from "react";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { CommonCartItem } from "~/domain/models/cart/CartModel";
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
  const selectedPlan = plans.find((item) => item.id === plan);
  invariantResponse(selectedPlan, "plan is required");

  const productsUseCase = getProductsFactory(authToken);
  const productsData = await productsUseCase.query(petId, plan);

  const cartCheckoutUseCase = getCartCheckoutFactory(authToken);
  const postCart = cartCheckoutUseCase.post;
  const getCart = cartCheckoutUseCase.query;

  const currentCart = await getCart();

  return defer({
    currentCart,
    getCart,
    petId,
    postCart,
    products: productsData,
    selectedPlan,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { currentCart, petId, postCart, products } =
    useLoaderData<typeof loader>();
  const [cartItems, setCartItems] = useState<CommonCartItem[]>([]);

  useDeepCompareEffect(() => {
    // do the logic to understand if the current cart is valid and them update the state

    if (currentCart) {
      // setCartItems(currentCart.items
    }
  }, [currentCart]);

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

  // const onUpdateCartMembership = (newMembership: CommonCartItem) => {
  //   setCartItems((prevState) => {
  //     const updatedState = prevState.map((item)  => {
  //       // find the current membership in the cart
  //       if (item.id === newMembership.id) {
  //         return newMembership;
  //       }

  //       return item;
  //     })

  //     void postCart(updatedState, petId);
  //     return updatedState;
  //   })
  // }

  return {
    cartItems,
    onUpdateCartProduct,
    products,
  };
};
