import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";

import { useAccountEmergencyContactViewModel } from "./useAccountEmergencyContactViewModel";
import { useAccountFormViewModel } from "./useAccountFormViewModel";
import { AccountRootLoaderData } from "./useAccountRootViewModel";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  const getCountriesUseCase = getCountriesUseCaseFactory();
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetailsQuery: accountDetailsUseCase.query(),
    deleteEmergencyContactMutation: accountEmergencyContactsUseCase.delete,
    emergencyContactsQuery: accountEmergencyContactsUseCase.query(),
    countries: getCountriesUseCase.query(),
    mutateAccountDetails: accountDetailsUseCase.mutate,
    submitEmergencyContactsMutation: accountEmergencyContactsUseCase.mutate,
    statesQuery: getStatesUseCase.query,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetailsQuery,
    deleteEmergencyContactMutation,
    emergencyContactsQuery,
    countries,
    mutateAccountDetails,
    submitEmergencyContactsMutation,
    statesQuery,
  } = useLoaderData<typeof loader>();
  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");

  const accountForm = useAccountFormViewModel({
    accountDetailsQuery,
    countries,
    isExternalLogin: !!accountRootData?.isExternalLogin,
    mutateAccountDetails,
    statesQuery,
  });

  const emergencyContactsForm = useAccountEmergencyContactViewModel({
    deleteEmergencyContactMutation,
    emergencyContactsQuery,
    isExternalLogin: !!accountRootData?.isExternalLogin,
    submitEmergencyContactsMutation,
  });

  const isExternalLogin = !!accountRootData?.isExternalLogin;

  return {
    accountForm,
    emergencyContactsForm,
    isExternalLogin,
  };
};
