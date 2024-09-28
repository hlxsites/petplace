import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationModel,
} from "~/domain/models/user/UserModels";
import { baseAccountDetailsIds } from "../form/accountForms";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null
): FormValues {
  return {
    [baseAccountDetailsIds.email]: accountDetails?.email ?? "",
    [baseAccountDetailsIds.name]: accountDetails?.name ?? "",
    [baseAccountDetailsIds.phone]: accountDetails?.phoneNumber ?? "",
    [baseAccountDetailsIds.surname]: accountDetails?.surname ?? "",
    [baseAccountDetailsIds.zipCode]: accountDetails?.zipCode ?? "",
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
    email: values[baseAccountDetailsIds.email] as string,
    name: values[baseAccountDetailsIds.name] as string,
    phoneNumber: values[baseAccountDetailsIds.phone] as string,
    surname: values[baseAccountDetailsIds.surname] as string,
    zipCode: values[baseAccountDetailsIds.zipCode] as string,
  };

  return accountDetails;
}

export function validateAccountDetails(accountDetails: AccountDetailsModel) {
  return validateNameOrSurname(accountDetails.name) && validateNameOrSurname(accountDetails.surname)
}

function validateNameOrSurname(value: string) {
  const pattern = /^[A-Za-z'-\s]+$/;
  return pattern.test(value);
}
