import {
  MembershipDescriptionOffer,
  MembershipInfo,
  MembershipPlan,
} from "~/domain/checkout/CheckoutModels";

export const ANNUAL_PROTECTION_PLAN_TITLE = "Annual Protection";
export const LIFETIME_PLAN_TITLE = "Lifetime";
export const LIFETIME_PLUS_PLAN_TITLE = "Lifetime Plus";

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  ANNUAL_PROTECTION_PLAN_TITLE,
  LIFETIME_PLAN_TITLE,
  LIFETIME_PLUS_PLAN_TITLE,
];

export const MEMBERSHIP_LIST_OFFERS: MembershipDescriptionOffer[] = [
  { offerLabel: "Get help finding your lost pet." },
  { offerLabel: "Direct connection to your pet's finder." },
  { offerLabel: "Discounts on pet sitting and supplies." },
  { offerLabel: "Critical info shared with shelter/vet. *" },
  { offerLabel: "Talk to a licensed vet anytime 24/7.*" },
  { offerLabel: "Lifetime warranty ID tag." },
  { offerLabel: "Pet Training Courses *." },
];

const addIconToOffers = (startIndex: number): MembershipDescriptionOffer[] =>
  MEMBERSHIP_LIST_OFFERS.map((item, index) =>
    index >= startIndex
      ? { ...item, icon: "clearCircle", isNotAvailableOnPlan: true }
      : item
  );

const ANNUAL_LIST_OFFERS = addIconToOffers(2);
const LIFETIME_LIST_OFFERS = addIconToOffers(5);

export const MEMBERSHIP_INFO_OPTIONS: Record<MembershipPlan, MembershipInfo> = {
  [ANNUAL_PROTECTION_PLAN_TITLE]: {
    buttonLabel: "Get 1 Year Protection",
    comparePlansButtonLabel: "Get Annual",
    membershipDescriptionOffers: ANNUAL_LIST_OFFERS,
    price: "$45.95",
    priceInfo: "For the first year, $19.95/year thereafter",
    subTitle: "Keep Your Pet Safe All Year",
    title: ANNUAL_PROTECTION_PLAN_TITLE,
  },
  [LIFETIME_PLAN_TITLE]: {
    buttonLabel: "Get the Best Value",
    comparePlansButtonLabel: "Get Lifetime",
    isHighlighted: true,
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: LIFETIME_LIST_OFFERS,
    price: "$99.95",
    priceInfo: "One-time fee",
    subTitle: "The Best Value Lost Pet Protection",
    title: LIFETIME_PLAN_TITLE,
  },
  [LIFETIME_PLUS_PLAN_TITLE]: {
    buttonLabel: "Unlock Complete Care",
    comparePlansButtonLabel: "Get Lifetime +",
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: MEMBERSHIP_LIST_OFFERS,
    price: "$199.95",
    priceInfo: "One-time fee",
    subTitle: "Complete Lost Pet Protection",
    title: LIFETIME_PLUS_PLAN_TITLE,
  },
};
