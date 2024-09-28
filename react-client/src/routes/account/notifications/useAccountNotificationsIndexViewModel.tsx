import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import {
  AccountNotificationsModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationDetailsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationDetailsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";
import { AccountRootLoaderData } from "../useAccountRootViewModel";

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

  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");
  const isExternalLogin = !!accountRootData?.isExternalLogin;

  return {
    accountNotifications,
    isExternalLogin,
    lostPetsHistory,
    onSubmitAccountNotifications,
    getLostPetNotification,
  };
};
