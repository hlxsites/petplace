import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { useOutletContext } from "react-router-dom";
import { AccountNotificationsModel } from "~/domain/models/user/UserModels";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";
import { AccountRootLoaderData } from "../useAccountRootViewModel";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);

  function onSubmitAccountNotifications(values: AccountNotificationsModel) {
    void accountNotificationsUseCase.mutate(values);
  }

  return defer({
    accountNotifications: accountNotificationsUseCase.query(),
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountNotifications,
  });
}) satisfies LoaderFunction;

export type AccountNotificationsIndexLoaderData = ReturnType<typeof loader>;

export const useAccountNotificationsIndexViewModel = () => {
  const {
    accountNotifications,
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
  };
};

export const useAccountNotificationsIndexContext = () =>
  useOutletContext<ReturnType<typeof useAccountNotificationsIndexViewModel>>();
