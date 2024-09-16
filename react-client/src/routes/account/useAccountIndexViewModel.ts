import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { getLostPetsHistory } from "~/mocks/MockRestApiServer";
import { requireAuthToken } from "~/util/authUtil";

import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";

export const loader = (() => {
  const authToken = requireAuthToken();

  const useCase = accountDetailsUseCaseFactory(authToken);
  return defer({
    accountDetails: useCase.query(),
    lostPetsHistory: getLostPetsHistory(),
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const { accountDetails, lostPetsHistory } = useLoaderData<typeof loader>();

  return {
    accountDetails,
    lostPetsHistory,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
