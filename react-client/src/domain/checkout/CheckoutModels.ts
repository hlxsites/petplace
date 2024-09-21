export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipInfo = {
  buttonLabel: string;
  comparePlansButtonLabel: string;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: string;
};

export type MembershipPlan = "Annual Protection" | "Lifetime" | "Lifetime Plus";

export type CheckoutQueryReturnData = {
  plans: MembershipInfo[];
};
