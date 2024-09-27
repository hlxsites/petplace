import { useState } from "react";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { CommonCartItem } from "~/domain/models/cart/CartModel";
import getCartCheckoutFactory from "~/domain/useCases/cart/getCartCheckoutFactory";
import getProductsFactory from "~/domain/useCases/products/getProductsFactory";

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

  const productsUseCase = getProductsFactory(authToken);
  const productsData = await productsUseCase.query(petId, plan);

  const cartCheckoutUseCase = getCartCheckoutFactory(authToken);
  const postCart = cartCheckoutUseCase.post;
  const getCart = cartCheckoutUseCase.query;

  return defer({
    getCart,
    petId,
    plan,
    postCart,
    products: productsData,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { getCart, petId, plan, postCart, products } =
    useLoaderData<typeof loader>();
  const [cartItems, setCartItems] = useState<CommonCartItem[] | null>(null);

  const fetchCartItems = async () => {
    try {
      const items = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const onClearCart = () => {
    void postCart();
  };

  const onUpdateCartCheckout = async (data: MembershipInfo[]) => {
    await fetchCartItems();

    const filteredPlan = data.find((item) => item.type === plan);

    if (!filteredPlan) return null;

    const selectedDataPlan: CommonCartItem = {
      id: filteredPlan.id,
      quantity: 1,
      type: filteredPlan.type,
    };

    const itemsToPost = cartItems
      ? [...cartItems, selectedDataPlan]
      : [selectedDataPlan];

    void postCart(itemsToPost, petId);
  };

  return {
    cartItems,
    onClearCart,
    onUpdateCartCheckout,
    products,
  };
};
