import { LoaderFunction, useLoaderData } from "react-router-dom";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    accountInfo: [],
  };
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const { accountInfo } = useLoaderData() as LoaderData<typeof loader>;

  return {
    accountInfo,
  };
};
