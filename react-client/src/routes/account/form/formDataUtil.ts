import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationsModel,
} from "~/domain/models/user/UserModels";
import { baseAccountDetailsIds } from "./accountForms";
import { accountNotificationIds } from "./notificationForm";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null
): FormValues {
  return {
    [baseAccountDetailsIds.name]: accountDetails?.name ?? "",
    [baseAccountDetailsIds.surname]: accountDetails?.surname ?? "",
    [baseAccountDetailsIds.email]: accountDetails?.email ?? "",
    [baseAccountDetailsIds.phone]: accountDetails?.phoneNumber ?? "",
  };
}

export function getAccountNotificationsData(
  accountNotifications?: AccountNotificationsModel | null
): FormValues {
  const newsLetter = [];
  if (accountNotifications?.signedCatNewsletter) newsLetter.push("Cat");
  if (accountNotifications?.signedDogNewsletter) newsLetter.push("Dog");

  const alerts = [];
  if (accountNotifications?.smsAlert) alerts.push("SMS");
  if (accountNotifications?.emailAlert) alerts.push("Email");

  return {
    newsletter: newsLetter,
    "pet-place-offers": !!accountNotifications?.petPlaceOffer,
    "partner-offers": !!accountNotifications?.partnerOffer,
    "pet-place-adopt-alerts": alerts,
  };
}

export function buildAccountDetails(values: FormValues): AccountDetailsModel {
  const accountDetails: AccountDetailsModel = {
    email: values[baseAccountDetailsIds.email] as string,
    name: values[baseAccountDetailsIds.name] as string,
    phoneNumber: values[baseAccountDetailsIds.phone] as string,
    surname: values[baseAccountDetailsIds.surname] as string,
  };

  return accountDetails;
}

export function validateAccountDetails(accountDetails: AccountDetailsModel) {
  return (
    validateNameOrSurname(accountDetails.name) &&
    validateNameOrSurname(accountDetails.surname)
  );
}

function validateNameOrSurname(value: string) {
  const pattern = /^[A-Za-z'-\s]+$/;
  return pattern.test(value);
}

export function buildAccountNotifications(
  values: FormValues
): AccountNotificationsModel {
  const newsletter = values[accountNotificationIds.newsletter] as string[];
  const alerts = values[accountNotificationIds.petPlaceAdoptAlerts] as string[];
  const accountDetails: AccountNotificationsModel = {
    emailAlert: alerts.includes("Email"),
    petPlaceOffer: values[accountNotificationIds.petPlaceOffers] as boolean,
    partnerOffer: values[accountNotificationIds.partnerOffers] as boolean,
    signedCatNewsletter: newsletter.includes("Cat"),
    signedDogNewsletter: newsletter.includes("Dog"),
    smsAlert: alerts.includes("SMS"),
  };

  return accountDetails;
}
