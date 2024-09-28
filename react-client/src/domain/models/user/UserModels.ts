export type AccountNotificationsModel = {
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
  name: string;
  defaultPhone?: string;
  surname: string;
};

export type AccountEmergencyContactModel = {
  email: string;
  name: string;
  phoneNumber: string;
  surname: string;
};

export type ExternalAccountDetailsModel = InternalAccountDetailsModel & {
  address: AccountAddressModel;
  secondaryPhone?: string;
  contactConsent?: boolean;
  informationConsent?: boolean;
};

export type AccountAddressModel = {
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string;
  state: string;
};

export type MissingStatus = "missing" | "found";

export type ContactDone = {
  date?: number;
  email?: string;
};

export type FoundedByInfo = {
  contact?: ContactDone[];
  finderName?: string;
  finderOrganization?: string;
  finderPhoneNumber?: string;
};

export type LostPetUpdateModel = {
  date: number;
  id: string;
  communicationId: string;
  note?: string;
  petId: string;
  petName: string;
  status: MissingStatus;
  update: number;
  foundedBy?: FoundedByInfo;
};