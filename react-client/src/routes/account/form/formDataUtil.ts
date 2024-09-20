import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationModel,
} from "~/domain/models/user/UserModels";
import { baseAccountDetailsIds } from "./accountForms";

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
  accountNotifications?: AccountNotificationModel | null
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
    email: values["email-address"] as string,
    name: values["first-name"] as string,
    phoneNumber: values["phone-default"] as string,
    surname: values["last-name"] as string,
  };

  return accountDetails;
}
