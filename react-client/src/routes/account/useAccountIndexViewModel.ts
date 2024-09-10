import {
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { getAuthLogin, getLostPetsHistory } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    isExternalLogin: getAuthLogin(),
    lostPetsHistory: getLostPetsHistory(),
  };
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const { isExternalLogin, lostPetsHistory } = useLoaderData() as LoaderData<
    typeof loader
  >;

  return {
    isExternalLogin,
    lostPetsHistory,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
