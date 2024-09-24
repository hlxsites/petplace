import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { getLostPetsHistory } from "~/mocks/MockRestApiServer";
import { requireAuthToken } from "~/util/authUtil";

import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);
    
    function onSubmitEmergencyContacts (data: AccountEmergencyContactModel[]){
      void accountEmergencyContactsUseCase.mutate(data)
    }

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    emergencyContacts: accountEmergencyContactsUseCase.query(),
    onSubmitEmergencyContacts: onSubmitEmergencyContacts,
    lostPetsHistory: getLostPetsHistory(),
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    lostPetsHistory,
    onSubmitEmergencyContacts,
  } = useLoaderData<typeof loader>();

  return {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    lostPetsHistory,
    onSubmitEmergencyContacts,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
