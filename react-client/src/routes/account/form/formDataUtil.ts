import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationModel,
} from "~/domain/models/user/UserModels";
import { readJwtClaim } from "~/util/authUtil";
import { baseAccountDetailsIds } from "./accountForms";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null
): FormValues {
  const data = readJwtClaim();
  return {
    [baseAccountDetailsIds.name]: data?.given_name ?? "",
    [baseAccountDetailsIds.surname]: data?.family_name ?? "",
    [baseAccountDetailsIds.email]: data?.emails?.[0] ?? "",
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
