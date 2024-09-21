export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipInfo = {
  buttonLabel: string;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: MembershipPlan;
};

export type MembershipPlan = "Annual Protection" | "Lifetime" | "Lifetime Plus";

export type TableActions = {
  label: string;
  isPrimary?: boolean;
};

export type CheckoutQueryReturnData = {
  actionButtons: TableActions[];
  plans: MembershipInfo[];
};
