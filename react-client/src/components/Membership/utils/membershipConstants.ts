import {
  MembershipDescriptionOffer,
  MembershipInfoCard,
} from "./MembershipTypes";

const MEMBERSHIP_LIST_OFFERS = [
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
    index >= startIndex ? { ...item, icon: "clearCircle" } : item
  );

const ANNUAL_LIST_OFFERS = addIconToOffers(2);

const LIFETIME_LIST_OFFERS = addIconToOffers(5);

export const MEMBERSHIP_CARD_OPTIONS: MembershipInfoCard[] = [
  {
    buttonLabel: "Get 1 Year Protection",
    membershipDescriptionOffers: ANNUAL_LIST_OFFERS,
    price: "$45.95",
    priceInfo: "For the first year, $19.95/year thereafter",
    subTitle: "Keep Your Pet Safe All Year",
    title: "Annual Protection",
  },
  {
    buttonLabel: "Get the Best Value",
    cardProps: { backgroundColor: "bg-purple-100" },
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: LIFETIME_LIST_OFFERS,
    price: "$99.95",
    priceInfo: "One-time fee",
    subTitle: "The Best Value Lost Pet Protection",
    title: "Lifetime",
  },
  {
    buttonLabel: "Unlock Complete Care",
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: MEMBERSHIP_LIST_OFFERS,
    price: "$199.95",
    priceInfo: "One-time fee",
    subTitle: "Complete Lost Pet Protection",
    title: "Lifetime Plus",
  },
];
