export type AccountNotificationPreferencesModel = {
  emailAlert: boolean;
  petPlaceOffer: boolean;
  partnerOffer: boolean;
  signedCatNewsletter: boolean;
  signedDogNewsletter: boolean;
  smsAlert: boolean;
};

export type AccountDetailsModel =
  | InternalAccountDetailsModel
  | ExternalAccountDetailsModel;

export type InternalAccountDetailsModel = {
  email?: string;
  name: string;
  defaultPhone?: string;
  surname: string;
  zipCode: string;
};

export type AccountEmergencyContactModel = {
  contactId: string;
  email: string;
  name: string;
  phoneNumber: string;
  stagingId: number;
  surname: string;
};

// The zipCode is contained within the address object for external account
export type ExternalAccountDetailsModel = Omit<
  InternalAccountDetailsModel & {
    address: AccountAddressModel;
    secondaryPhone?: string;
    contactConsent?: boolean;
    informationConsent?: boolean;
    insuranceUrl?: string;
  },
  "zipCode"
>;

export type AccountAddressModel = {
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string;
  state: string;
};
