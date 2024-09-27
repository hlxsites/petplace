import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import {
  AccountDetailsModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationDetailsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationDetailsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { validateAccountDetails } from "./form/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);
  const lostPetNotificationDetailsUseCase =
    lostPetNotificationDetailsUseCaseFactory(authToken);

  function onSubmitAccountDetails(values: AccountDetailsModel) {
    if (validateAccountDetails(values))
      void accountDetailsUseCase.mutate(values);
  }

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    getLostPetNotification: (id: LostPetUpdateModel) =>
      lostPetNotificationDetailsUseCase.query(id),
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountDetails,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    getLostPetNotification,
    lostPetsHistory,
    onSubmitAccountDetails,
  } = useLoaderData<typeof loader>();

  return {
    accountDetails,
    accountNotifications,
    lostPetsHistory,
    onSubmitAccountDetails,
    getLostPetNotification,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
