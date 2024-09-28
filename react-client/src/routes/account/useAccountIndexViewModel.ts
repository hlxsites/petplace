import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { checkIsExternalLogin, requireAuthToken } from "~/util/authUtil";

import { useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
  AccountNotificationsModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationDetailsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationDetailsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import {
  buildAccountDetails,
  validateAccountDetails,
} from "./util/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  // TODO: This must be moved to another viewModel, specific for /account/notifications route
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);
  const lostPetNotificationDetailsUseCase =
    lostPetNotificationDetailsUseCaseFactory(authToken);

  function onSubmitAccountNotifications(values: AccountNotificationsModel) {
    void accountNotificationsUseCase.mutate(values);
  }

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  function onSubmitEmergencyContacts(data: AccountEmergencyContactModel[]) {
    void accountEmergencyContactsUseCase.mutate(data);
  }

  const getCountriesUseCase = getCountriesUseCaseFactory();
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    emergencyContacts: accountEmergencyContactsUseCase.query(),
    onSubmitEmergencyContacts: onSubmitEmergencyContacts,
    getLostPetNotification: (id: LostPetUpdateModel) =>
      lostPetNotificationDetailsUseCase.query(id),
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountNotifications,
    countries: getCountriesUseCase.query(),
    getStates: getStatesUseCase.query,
    mutateAccountDetails: accountDetailsUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    getLostPetNotification,
    countries,
    lostPetsHistory,
    mutateAccountDetails,
    onSubmitEmergencyContacts,
    onSubmitAccountNotifications,
  } = useLoaderData<typeof loader>();

  // TODO implement dynamic state call based in country selector
  const [stateVariables] = useState([]);

  const isExternalLogin = checkIsExternalLogin();

  const countryOptions = countries.map((country) => country.title);

  const onSubmitAccountDetails = (formValues: FormValues) => {
    const accountDetails: AccountDetailsModel = buildAccountDetails(formValues);
    if (validateAccountDetails(accountDetails))
      void mutateAccountDetails(accountDetails);
  };

  return {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    isExternalLogin,
    lostPetsHistory,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    onSubmitAccountNotifications,
    getLostPetNotification,
    accountDetailsFormVariables: {
      countryOptions,
      stateOptions: stateVariables,
    },
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
