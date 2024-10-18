import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { checkIsSsoEnabledLogin, requireAuthToken } from "~/util/authUtil";

import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FormValues } from "~/components/design-system";
import { OnSubmitFn } from "~/components/design-system/form/FormBuilder";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { AccountNotificationPreferencesModel } from "~/domain/models/user/UserModels";
import accountNotificationPreferencesUseCaseFactory from "~/domain/useCases/user/accountNotificationPreferencesUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
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
    query: notificationPreferencesUseCase.query,
  });
}) satisfies LoaderFunction;

export type AccountNotificationsIndexLoaderData = ReturnType<typeof loader>;

export const useAccountNotificationsIndexViewModel = () => {
  const initialFormValues = useRef<FormValues>({});

  const { isSsoEnabledLogin, lostPetsHistory, mutation, query } =
    useLoaderData<typeof loader>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  const isDirty = !isEqual(formValues, initialFormValues.current);

  useEffect(() => {
    const onFetchAccountNotifications = async () => {
      const model = await query();
      const initial = getFormInitialDataFroModel(model);

      initialFormValues.current = initial;
      setFormValues(initial);
      setIsLoading(false);
    };

    void onFetchAccountNotifications();
  }, [query]);

  // useEffect(() => {
  //   const onFetchLostPetsHistory = async () => {
  //     const list = await lostPetsHistoryQuery();
  //     setLostPetsHistory(list);
  //     setIsLoadingLostPetsHistory(false);
  //   };

  //   // only fetch lost pets history if SSO is enabled
  //   if (isSsoEnabledLogin && !isLoadingLostPetsHistory) {
  //     setIsLoadingLostPetsHistory(true);
  //     void onFetchLostPetsHistory();
  //   }
  // }, [isLoadingLostPetsHistory, isSsoEnabledLogin, lostPetsHistoryQuery]);

  const asyncSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    const data = convertFormValuesToModel(values);
    await mutation(data);

    initialFormValues.current = values;
    setIsSubmitting(false);
  };

  const onSubmit: OnSubmitFn = ({ values }) => {
    void asyncSubmit(values);
  };

  return {
    formValues,
    isSsoEnabledLogin,
    isDirty,
    isLoading,
    isSubmitting,
    lostPetsHistory,
    onChangeForm: setFormValues,
    onSubmit,
  };
};

export const useAccountNotificationsIndexContext = () =>
  useOutletContext<ReturnType<typeof useAccountNotificationsIndexViewModel>>();

function getFormInitialDataFroModel(
  accountNotifications?: AccountNotificationPreferencesModel | null
): FormValues {
  const newsLetter = [];
  if (accountNotifications?.signedCatNewsletter) newsLetter.push("Cat");
  if (accountNotifications?.signedDogNewsletter) newsLetter.push("Dog");

  const alerts = [];
  if (accountNotifications?.smsAlert) alerts.push("SMS");
  if (accountNotifications?.emailAlert) alerts.push("Email");

  return {
    newsletter: newsLetter,
    "pet-place-offers": accountNotifications?.petPlaceOffer ?? "",
    "partner-offers": accountNotifications?.partnerOffer ?? "",
    "pet-place-adopt-alerts": alerts,
  } satisfies FormValues;
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
