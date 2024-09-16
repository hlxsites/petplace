import { FormValues } from "~/components/design-system";
import { AccountDetailsModel, AccountNotificationModel } from "~/domain/models/user/UserModels";
import { readJwtClaim } from "~/util/authUtil";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null
) {
  const data = readJwtClaim();
  return {
    "first-name": data?.given_name,
    "last-name": data?.family_name,
    "email-address": data?.emails[0],
    "phone-default": accountDetails?.phoneNumber,
  } as FormValues;
}


export function getAccountNotificationsData(
    accountNotifications?: AccountNotificationModel | null
  ) {
    const newsLetter = [];
    if (accountNotifications?.signedCatNewsletter) newsLetter.push("Cat");
    if (accountNotifications?.signedDogNewsletter) newsLetter.push("Dog");

    const alerts = [];
    if (accountNotifications?.smsAlert) alerts.push("SMS");
    if (accountNotifications?.emailAlert) alerts.push("Email");

    return {
      newsletter: newsLetter,
      "pet-place-offers": accountNotifications?.petPlaceOffer,
      "partner-offers": accountNotifications?.partnerOffer,
      "pet-place-adopt-alerts": alerts,
    } as FormValues;
  }