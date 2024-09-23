export type AccountNotificationModel = {
  emailAlert?: boolean;
  petPlaceOffer?: boolean;
  partnerOffer?: boolean;
  signedCatNewsletter?: boolean;
  signedDogNewsletter?: boolean;
  smsAlert?: boolean;
};

export type AccountDetailsModel =
  | InternalAccountDetailsModel
  | ExternalAccountDetailsModel;

export type InternalAccountDetailsModel = {
  email?: string;
  name?: string;
  defaultPhone?: string;
  surname?: string;
};

export type ExternalAccountDetailsModel = InternalAccountDetailsModel & {
  address: AccountAddressModel;
  secondaryPhone?: string;
  contactConsent?: boolean;
  informationConsent?: boolean;
};

export type AccountAddressModel = {
  address1?: string;
  address2?: string;
  intersection?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  state?: string;
};
