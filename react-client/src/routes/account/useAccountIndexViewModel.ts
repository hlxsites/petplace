import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { getLostPetsHistory } from "~/mocks/MockRestApiServer";
import { checkIsExternalLogin, requireAuthToken } from "~/util/authUtil";

import { useEffect, useState } from "react";
import { FormValues } from "~/components/design-system";
import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import {
  buildAccountDetails,
  validateAccountDetails,
} from "./util/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const getCountriesUseCase = getCountriesUseCaseFactory(authToken);
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    getCountries: getCountriesUseCase.query,
    getStates: getStatesUseCase.query,
    lostPetsHistory: getLostPetsHistory(),
    mutateAccountDetails: accountDetailsUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    getCountries,
    getStates,
    lostPetsHistory,
    mutateAccountDetails,
  } = useLoaderData<typeof loader>();

  const [countryVariables, setCountryVariables] = useState<string[]>([]);
  // TODO implement dynamic state call based in country selector
  const [stateVariables] = useState([]);

  const isExternalLogin = checkIsExternalLogin();

  useEffect(() => {
    async function collectCountries() {
      const countries = await getCountries();
      setCountryVariables(countries);
    }

    void collectCountries();
  }, [getCountries, getStates]);

  return {
    accountDetails,
    accountNotifications,
    isExternalLogin,
    lostPetsHistory,
    onSubmitAccountDetails,
    accountDetailsFormVariables: {
      countryOptions: countryVariables,
      stateOptions: stateVariables,
    },
  };

  function onSubmitAccountDetails(formValues: FormValues) {
    const accountDetails: AccountDetailsModel = buildAccountDetails(formValues);
    if (validateAccountDetails(accountDetails))
      void mutateAccountDetails(accountDetails);
  }
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
