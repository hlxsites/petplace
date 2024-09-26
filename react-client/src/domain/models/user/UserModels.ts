export type AccountNotificationModel = {
  emailAlert?: boolean;
  petPlaceOffer?: boolean;
  partnerOffer?: boolean;
  signedCatNewsletter?: boolean;
  signedDogNewsletter?: boolean;
  smsAlert?: boolean;
};

export type AccountDetailsModel = {
  email: string;
  name: string;
  phoneNumber: string;
  surname: string;
  zipCode: string;
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