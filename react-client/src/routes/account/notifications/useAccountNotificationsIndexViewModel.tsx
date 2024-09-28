import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { checkIsExternalLogin, requireAuthToken } from "~/util/authUtil";

import {
  AccountNotificationsModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationDetailsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationDetailsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);
  const lostPetNotificationDetailsUseCase =
    lostPetNotificationDetailsUseCaseFactory(authToken);

  function onSubmitAccountNotifications(values: AccountNotificationsModel) {
    void accountNotificationsUseCase.mutate(values);
  }

  return defer({
    accountNotifications: accountNotificationsUseCase.query(),
    getLostPetNotification: (id: LostPetUpdateModel) =>
      lostPetNotificationDetailsUseCase.query(id),
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountNotifications,
  });
}) satisfies LoaderFunction;

export const useAccountNotificationsIndexViewModel = () => {
  const {
    accountNotifications,
    getLostPetNotification,
    lostPetsHistory,
    onSubmitAccountNotifications,
  } = useLoaderData<typeof loader>();

  const isExternalLogin = checkIsExternalLogin();

  return {
    accountNotifications,
    isExternalLogin,
    lostPetsHistory,
    onSubmitAccountNotifications,
    getLostPetNotification,
  };
};

export const useAccountNotificationsIndexContext = () =>
  useOutletContext<ReturnType<typeof useAccountNotificationsIndexViewModel>>();
