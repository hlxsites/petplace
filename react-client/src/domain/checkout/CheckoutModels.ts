export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipInfo = {
  buttonLabel: string;
  comparePlansButtonLabel: string;
  id: MembershipPlanId;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: string;
};

export type MembershipPlanId =
  | "AnnualMembership"
  | "LPMMembership"
  | "LPMPlusMembership";

export type CheckoutQueryReturnData = {
  plans: MembershipInfo[];
};
