import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
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

  const onClearCart = () => {
    void cartCheckoutUseCase.post();
  };

  return defer({
    onClearCart,
    products: productsData,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { onClearCart, products } = useLoaderData<typeof loader>();

  return {
    onClearCart,
    products,
  };
};
