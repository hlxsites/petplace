import { FormValues } from "~/components/design-system";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
  ExternalAccountDetailsModel,
  InternalAccountDetailsModel,
} from "~/domain/models/user/UserModels";
import {
  accountAddressIds,
  accountAgreementsIds,
  baseAccountDetailsIds,
  emergencyContactIds,
} from "../form/accountForms";

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
    [baseAccountDetailsIds.name]: accountDetails.name ?? "",
    [baseAccountDetailsIds.surname]: accountDetails.surname ?? "",
    [baseAccountDetailsIds.email]: accountDetails.email ?? "",
    [baseAccountDetailsIds.phone]: accountDetails.defaultPhone ?? "",
  } satisfies FormValues;
}

export function getExternalAccountDetailsData(
  accountDetails: ExternalAccountDetailsModel
) {
  return {
    ...getInternalAccountDetailsData(accountDetails),
    [accountAddressIds.country]: accountDetails.address.country ?? "",
    [accountAddressIds.state]: accountDetails.address.state,
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
  } satisfies FormValues;
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

export function buildAccountDetails(
  values: FormValues,
  isExternalLogin?: boolean
): AccountDetailsModel {
  const accountDetails: AccountDetailsModel = {
    email: values[baseAccountDetailsIds.email] as string,
    name: values[baseAccountDetailsIds.name] as string,
    defaultPhone: values[baseAccountDetailsIds.phone] as string,
    surname: values[baseAccountDetailsIds.surname] as string,
  };

  if (!isExternalLogin) return accountDetails;

  return {
    ...accountDetails,
    address: {
      address1: values[accountAddressIds.address1] as string,
      address2: values[accountAddressIds.address2] as string,
      city: values[accountAddressIds.city] as string,
      country: values[accountAddressIds.country] as string,
      state: values[accountAddressIds.state] as string,
      zipCode: values[accountAddressIds.zipCode] as string,
    },
    contactConsent: !!(values[accountAgreementsIds.contactConsent] as string[])
      .length,
    informationConsent: !!(
      values[accountAgreementsIds.informationConsent] as string[]
    ).length,
    secondaryPhone: values[baseAccountDetailsIds.secondaryPhone] as string,
  };
}

export function validateAccountDetails(accountDetails: AccountDetailsModel) {
  return (
    validateNameOrSurname(accountDetails.name) &&
    validateNameOrSurname(accountDetails.surname)
  );
}

function validateNameOrSurname(value?: string) {
  const pattern = /^[A-Za-z'-\s]+$/;
  return value ? pattern.test(value) : false;
}
