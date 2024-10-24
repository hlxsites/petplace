import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { checkIsSsoEnabledLogin, requireAuthToken } from "~/util/authUtil";

import { useOutletContext } from "react-router-dom";
import { FormValues } from "~/components/design-system";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { AccountNotificationPreferencesModel } from "~/domain/models/user/UserModels";
import accountNotificationPreferencesUseCaseFactory from "~/domain/useCases/user/accountNotificationPreferencesUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { useFormValuesWithQueryAndMutate } from "~/hooks/useFormValuesWithQueryAndMutate";
import { accountNotificationIds } from "../form/notificationForm";

export const loader = (() => {
  const authToken = requireAuthToken();

  const isSsoEnabledLogin = checkIsSsoEnabledLogin();

  const notificationPreferencesUseCase =
    accountNotificationPreferencesUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);

  const lostPetsHistory: Promise<LostPetUpdateModel[]> = (() => {
    if (isSsoEnabledLogin) {
      return lostPetNotificationsUseCase.query();
    }
    return Promise.resolve([]);
  })();

  return defer({
    isSsoEnabledLogin,
    lostPetsHistory,
    mutation: notificationPreferencesUseCase.mutate,
    queryPreferences: notificationPreferencesUseCase.query,
  });
}) satisfies LoaderFunction;

export type AccountNotificationsIndexLoaderData = ReturnType<typeof loader>;

export const useAccountNotificationsIndexViewModel = () => {
  const { isSsoEnabledLogin, lostPetsHistory, mutation, queryPreferences } =
    useLoaderData<typeof loader>();

  const mutateFn = (values: FormValues) => {
    const data = convertFormValuesToModel(values);
    return mutation(data);
  };

  const {
    formValues,
    isDirty,
    isLoading,
    isSubmitting,
    onChangeForm,
    onSubmitForm,
  } =
    useFormValuesWithQueryAndMutate<AccountNotificationPreferencesModel | null>(
      {
        convertQueryDataToFormValues: getFormInitialDataFromModel,
        queryFn: queryPreferences,
        key: "accountNotificationsPreferences",
        mutateFn,
      }
    );

  return {
    formValues,
    isSsoEnabledLogin,
    isDirty,
    isLoading,
    isSubmitting,
    lostPetsHistory,
    onChangeForm,
    onSubmit: onSubmitForm,
  };
};

export const useAccountNotificationsIndexContext = () =>
  useOutletContext<ReturnType<typeof useAccountNotificationsIndexViewModel>>();

function getFormInitialDataFromModel(
  accountNotifications?: AccountNotificationPreferencesModel | null
): Promise<FormValues> {
  const newsLetter = [];
  if (accountNotifications?.signedCatNewsletter) newsLetter.push("Cat");
  if (accountNotifications?.signedDogNewsletter) newsLetter.push("Dog");

  const alerts = [];
  if (accountNotifications?.smsAlert) alerts.push("SMS");
  if (accountNotifications?.emailAlert) alerts.push("Email");

  const formValues: FormValues = {
    newsletter: newsLetter,
    "pet-place-offers": accountNotifications?.petPlaceOffer ?? "",
    "partner-offers": accountNotifications?.partnerOffer ?? "",
    "pet-place-adopt-alerts": alerts,
  };
  return Promise.resolve(formValues)
}

function convertFormValuesToModel(
  values: FormValues
): AccountNotificationPreferencesModel {
  const newsletter = values[accountNotificationIds.newsletter] as string[];
  const alerts = values[accountNotificationIds.petPlaceAdoptAlerts] as string[];
  const accountDetails: AccountNotificationPreferencesModel = {
    emailAlert: alerts.includes("Email"),
    petPlaceOffer: values[accountNotificationIds.petPlaceOffers] as boolean,
    partnerOffer: values[accountNotificationIds.partnerOffers] as boolean,
    signedCatNewsletter: newsletter.includes("Cat"),
    signedDogNewsletter: newsletter.includes("Dog"),
    smsAlert: alerts.includes("SMS"),
  };

  return accountDetails;
}
