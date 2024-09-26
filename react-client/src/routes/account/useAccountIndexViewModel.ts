import { useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountNotificationsUseCaseFactory from "~/domain/useCases/user/accountNotificationsUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { validateAccountDetails } from "./form/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);
  const accountNotificationsUseCase =
    accountNotificationsUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);

  function onSubmitAccountDetails(values: AccountDetailsModel) {
    if (validateAccountDetails(values))
      void accountDetailsUseCase.mutate(values);
  }

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    accountNotifications: accountNotificationsUseCase.query(),
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    onSubmitAccountDetails,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    accountNotifications,
    lostPetsHistory,
    onSubmitAccountDetails,
  } = useLoaderData<typeof loader>();

  return {
    accountDetails,
    accountNotifications,
    lostPetsHistory,
    onSubmitAccountDetails,
  };
};

export const useAccountContext = () =>
  useOutletContext<ReturnType<typeof useAccountIndexViewModel>>();
