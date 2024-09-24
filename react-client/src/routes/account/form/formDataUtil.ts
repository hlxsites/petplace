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

export function buildAccountEmergencyContactsList(
  values: FormValues[]
): AccountEmergencyContactModel[] {
  const list: AccountEmergencyContactModel[] = [  ]
  values.forEach((contact) => list.push({
    email: contact[emergencyContactIds.email] as string,
    name: contact[emergencyContactIds.name] as string,
    phoneNumber: contact[emergencyContactIds.phone] as string,
    surname: contact[emergencyContactIds.surname] as string,
  }))

  return list;
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
