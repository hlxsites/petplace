import { LoaderFunction, useLoaderData } from "react-router-typesafe";

import { getProductsList } from "~/mocks/MockRestApiServer";
import { invariantResponse } from "~/util/invariant";

export const loader = (({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");
  invariantResponse(petId, "petId param is required");

  const plan = url.searchParams.get("plan");
  invariantResponse(plan, "plan param is required");

  return {
    products: getProductsList(),
  };
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { products } = useLoaderData<typeof loader>();

  return {
    products,
  };
};
