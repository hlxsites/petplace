import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
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
  const useCase = getProductsFactory(authToken);

  const productsData = await useCase.query(petId);

  return defer({
    products: productsData,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { products } = useLoaderData<typeof loader>();

  return {
    products,
  };
};
