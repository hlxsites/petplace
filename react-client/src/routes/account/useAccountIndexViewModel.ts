import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
  AccountNotificationsModel,
} from "~/domain/models/user/UserModels";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { validateAccountDetails } from "./form/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  // TODO: This must be moved to another viewModel, specific for /account/notifications route
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);

  function onSubmitAccountDetails(values: AccountDetailsModel) {
    if (validateAccountDetails(values))
      void accountDetailsUseCase.mutate(values);
  }

  function onSubmitAccountNotifications(values: AccountNotificationsModel) {
    void accountNotificationsUseCase.mutate(values);
  }

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  function onSubmitEmergencyContacts(data: AccountEmergencyContactModel[]) {
    void accountEmergencyContactsUseCase.mutate(data);
  }

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    emergencyContacts: accountEmergencyContactsUseCase.query(),
    onSubmitEmergencyContacts: onSubmitEmergencyContacts,
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountDetails,
    onSubmitAccountNotifications,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    lostPetsHistory,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    onSubmitAccountNotifications,
  } = useLoaderData<typeof loader>();

  return {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    lostPetsHistory,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    onSubmitAccountNotifications,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
