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
};
