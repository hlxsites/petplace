import { useOutletContext } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { getAuthLogin, getLostPetsHistory } from "~/mocks/MockRestApiServer";

export const loader = (() => {
  return {
    isExternalLogin: getAuthLogin(),
    lostPetsHistory: getLostPetsHistory(),
  };
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const { isExternalLogin, lostPetsHistory } = useLoaderData<typeof loader>();

  return {
    isExternalLogin,
    lostPetsHistory,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
