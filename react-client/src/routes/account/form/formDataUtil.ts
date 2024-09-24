import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationModel,
} from "~/domain/models/user/UserModels";
import { readJwtClaim } from "~/util/authUtil";
import { baseAccountDetailsIds } from "./accountForms";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null
) {
  return {
    [baseAccountDetailsIds.name]: accountDetails?.name,
    [baseAccountDetailsIds.surname]: accountDetails?.surname,
    [baseAccountDetailsIds.email]: accountDetails?.email,
    [baseAccountDetailsIds.phone]: accountDetails?.phoneNumber,
  } as FormValues;
}
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
