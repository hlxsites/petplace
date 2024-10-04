export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipPlanId =
  | "AnnualMembership"
  | "LPMMembership"
  | "LPMPlusMembership";

export type MembershipInfo = {
  buttonLabel: string;
  comparePlansButtonLabel: string;
  id: string;
  hardCodedPlanId: MembershipPlanId;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: string;
  type: string;
};

export type CheckoutQueryReturnData = {
  plans: MembershipInfo[];
};
