import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountNotificationModel,
  ExternalAccountDetailsModel,
  InternalAccountDetailsModel,
} from "~/domain/models/user/UserModels";
import {
  accountAddressIds,
  accountAgreementsIds,
  baseAccountDetailsIds,
} from "./accountForms";

export function getAccountDetailsData(
  accountDetails?: AccountDetailsModel | null,
  isExternalLogin?: boolean
) {
  if (!accountDetails) return {};
  if (!isExternalLogin) return getInternalAccountDetailsData(accountDetails);

  return getExternalAccountDetailsData(
    accountDetails as ExternalAccountDetailsModel
  );
}

export function getInternalAccountDetailsData(
  accountDetails: InternalAccountDetailsModel
) {
  return {
    [baseAccountDetailsIds.name]: accountDetails.name,
    [baseAccountDetailsIds.surname]: accountDetails.surname,
    [baseAccountDetailsIds.email]: accountDetails.email,
    [baseAccountDetailsIds.phone]: accountDetails.defaultPhone,
  } as FormValues;
}

export function getExternalAccountDetailsData(
  accountDetails: ExternalAccountDetailsModel
) {
  return {
    ...getInternalAccountDetailsData(accountDetails),
    [accountAddressIds.country]: accountDetails.address.country,
    [accountAddressIds.state]: accountDetails.address.state,
    [accountAddressIds.intersection]: accountDetails.address.intersection,
    [accountAddressIds.city]: accountDetails.address.city,
    [accountAddressIds.zipCode]: accountDetails.address.zipCode,
    [accountAddressIds.address1]: accountDetails.address.address1,
    [accountAddressIds.address2]: accountDetails.address.address2,
    [accountAgreementsIds.contactConsent]: !accountDetails.contactConsent
      ? []
      : [
          `In the event that your pet is missing and is found by a Good Samaritan, you give your consent for us to release your contact information to the finder. This may include your name, phone number, address and email address.`,
        ],
    [accountAgreementsIds.informationConsent]:
      !accountDetails.informationConsent
        ? []
        : [
            `With your 24Pet® microchip, Pethealth Services (USA) Inc. ("PSU") may offer you free lost pet services, as well as exclusive offers, promotions and the latest information from 24Pet regarding microchip services. Additionally, PSU's affiliates, including PTZ Insurance Agency, Ltd., PetPartners, Inc. and Independence Pet Group, Inc., and their subsidiaries (collectively, "PTZ") may offer you promotions and the latest information regarding pet insurance services and products. PSU may also have or benefit from contractual arrangements with third parties ("Partners") who may offer you related services, products, offers and/or promotions.By giving consent, you agree that PSU, its Partners and/or PTZ may contact you for the purposes identified herein via commercial electronic messages at the e-mail address you provided, via mailer at the mailing address you provided and/or via automatic telephone dialing systems, pre-recorded/automated messages and/or text messages at the telephone number(s) you provided. Data and message rates may apply. This consent is not a condition of the purchase of any goods or services. You understand that if you choose not to provide your consent, you will not receive the above-mentioned communications or free lost pet services, which includes being contacted with information in the event that your pet goes missing.You may withdraw your consent at any time.`,
          ],
  } as FormValues;
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
    "pet-place-offers": accountNotifications?.petPlaceOffer,
    "partner-offers": accountNotifications?.partnerOffer,
    "pet-place-adopt-alerts": alerts,
  } as FormValues;
}

export function buildAccountDetails(values: FormValues): AccountDetailsModel {
  const accountDetails: AccountDetailsModel = {
    email: values["email-address"] as string,
    name: values["first-name"] as string,
    defaultPhone: values["phone-default"] as string,
    surname: values["last-name"] as string,
  };

  return accountDetails;
}

export function validateAccountDetails(accountDetails: AccountDetailsModel) {
  return validateNameOrSurname(accountDetails.name) && validateNameOrSurname(accountDetails.surname)
}

function validateNameOrSurname(value?: string) {
  const pattern = /^[A-Za-z'-\s]+$/;
  return value ? pattern.test(value) : false;
}
