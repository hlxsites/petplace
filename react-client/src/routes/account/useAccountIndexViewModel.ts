import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
} from "~/domain/models/user/UserModels";
import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";
import { AccountRootLoaderData } from "./useAccountRootViewModel";
import {
  buildAccountDetails,
  validateAccountDetails,
} from "./util/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  function onSubmitEmergencyContacts(data: AccountEmergencyContactModel[]) {
    void accountEmergencyContactsUseCase.mutate(data);
  }

  const getCountriesUseCase = getCountriesUseCaseFactory();
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    emergencyContacts: accountEmergencyContactsUseCase.query(),
    onSubmitEmergencyContacts: onSubmitEmergencyContacts,
    countries: getCountriesUseCase.query(),
    getStates: getStatesUseCase.query,
    mutateAccountDetails: accountDetailsUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    emergencyContacts,
    countries,
    mutateAccountDetails,
    onSubmitEmergencyContacts,
  } = useLoaderData<typeof loader>();

  // TODO implement dynamic state call based in country selector
  const [stateVariables] = useState([]);

  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");
  const isExternalLogin = !!accountRootData?.isExternalLogin;

  const countryOptions = countries.map((country) => country.title);

  const onSubmitAccountDetails = (formValues: FormValues) => {
    const accountDetails: AccountDetailsModel = buildAccountDetails(formValues);
    if (validateAccountDetails(accountDetails))
      void mutateAccountDetails(accountDetails);
  };

  return {
    accountDetails,
    emergencyContacts,
    isExternalLogin,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    accountDetailsFormVariables: {
      countryOptions,
      stateOptions: stateVariables,
    },
  };
};
