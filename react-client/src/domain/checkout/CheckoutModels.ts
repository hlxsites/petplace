export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipInfo = {
  buttonLabel: string;
  comparePlansButtonLabel: string;
  id: string;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: string;
  type: string;
};

export type MembershipPlanId =
  | "AnnualProduct"
  | "PLH_000007"
  | "LPMPLUSProduct";

export type CheckoutQueryReturnData = {
  plans: MembershipInfo[];
};
