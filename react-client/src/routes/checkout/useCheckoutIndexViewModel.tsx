import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getProductsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    products: getProductsList(),
  };
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { products } = useLoaderData() as LoaderData<typeof loader>;

  return {
    products,
  };
};
