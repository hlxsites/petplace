import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
  AccountNotificationModel,
} from "~/domain/models/user/UserModels";
import { baseAccountDetailsIds, emergencyContactIds } from "./accountForms";

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

export function getAccountEmergencyContactsData(
  emergencyContacts?: AccountEmergencyContactModel[] | null
) {
  const contacts: FormValues[] = [];
  emergencyContacts?.forEach((contact) =>
    contacts.push({
      [emergencyContactIds.name]: contact.name,
      [emergencyContactIds.surname]: contact.surname,
      [emergencyContactIds.email]: contact.email,
      [emergencyContactIds.phone]: contact.phoneNumber,
    })
  );

  return { [emergencyContactIds.repeaterId]: contacts };
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
