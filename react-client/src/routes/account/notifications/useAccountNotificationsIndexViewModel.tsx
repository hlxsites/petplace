import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { isEqual } from "lodash";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FormValues } from "~/components/design-system";
import { OnSubmitFn } from "~/components/design-system/form/FormBuilder";
import { AccountNotificationPreferencesModel } from "~/domain/models/user/UserModels";
import accountNotificationPreferencesUseCaseFactory from "~/domain/useCases/user/accountNotificationPreferencesUseCaseFactory";
import lostPetNotificationsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationsUseCaseFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { useRouteMatchesData } from "~/hooks/useRouteMatchesData";
import { accountNotificationIds } from "../form/notificationForm";
import { AccountRootLoaderData } from "../useAccountRootViewModel";

export const loader = (() => {
  const authToken = requireAuthToken();

  const notificationPreferencesUseCase =
    accountNotificationPreferencesUseCaseFactory(authToken);
  const lostPetNotificationsUseCase =
    lostPetNotificationsUseCaseFactory(authToken);

  return defer({
    lostPetsHistory: lostPetNotificationsUseCase.query(),
    mutation: notificationPreferencesUseCase.mutate,
    query: notificationPreferencesUseCase.query,
  });
}) satisfies LoaderFunction;

export type AccountNotificationsIndexLoaderData = ReturnType<typeof loader>;

export const useAccountNotificationsIndexViewModel = () => {
  const initialFormValues = useRef<FormValues>({});

  const { lostPetsHistory, mutation, query } = useLoaderData<typeof loader>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  const isDirty = !isEqual(formValues, initialFormValues.current);

  useDeepCompareEffect(() => {
    const onFetchAccountNotifications = async () => {
      const model = await query();
      const initial = getFormInitialDataFroModel(model);

      initialFormValues.current = initial;
      setFormValues(initial);
      setIsLoading(false);
    };

    void onFetchAccountNotifications();
  }, []);

  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");
  const isExternalLogin = !!accountRootData?.isExternalLogin;

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
    isExternalLogin,
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
