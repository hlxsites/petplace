import { MembershipPlan, TableActions } from "../types/MembershipTypes";
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

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  "Annual Protection",
  "Lifetime",
  "Lifetime Plus",
];

export const US_MEMBERSHIP_PLANS: MembershipPlan[] = [...MEMBERSHIP_PLANS];

export const CA_MEMBERSHIP_PLANS: MembershipPlan[] = [
  "Lifetime",
  "Lifetime Plus",
];

export const MEMBERSHIP_COMPARE_PLANS = [
  {
    availableColumns: MEMBERSHIP_PLANS,
    label:
      "Quickly report a lost or found pet through the portal or our Customer Service Representatives.",
    title: "Access to Portal",
  },
  {
    availableColumns: MEMBERSHIP_PLANS,
    label:
      "Get access to specialists who can quickly launch the process of finding your pet.",
    title: "Lost Pet Support",
  },
  {
    availableColumns: MEMBERSHIP_PLANS,
    label: "Connect with your pet's finder and arrange a quick, safe reunion.",
    title: "DirectConnect",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(1),
    label:
      "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
    title: "24/7 VetHelpline",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(1),
    label:
      "Critical medical and behavioral information will be relayed to the shelter or vet when found.",
    title: "24PetMedAlert®",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(1),
    label: "Save on pet-sitting and dog-walking services from Rover.com.",
    title: "$30 Rover Coupon",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(1),
    label:
      "Redeem for in-store purchases at Petco with Petco Vital Care member sign-up.",
    title: "$25 Petco Coupon",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(2),
    label:
      "Get an ID tag customized with your pet’s name and unique microchip number.",
    title: "Lifetime Warranty ID Tag",
  },
  {
    availableColumns: MEMBERSHIP_PLANS.slice(2),
    label: "Simple, easy to follow lessons for you and your pet.",
    title: "Petcademy",
  },
];

export const MEMBERSHIP_COMPARING_PLANS_BUTTONS: TableActions[] = [
  {
    label: "Get Annual",
    variant: "secondary",
  },
  {
    label: "Get Lifetime",
    variant: "primary",
  },
  {
    label: "Get Lifetime +",
    variant: "secondary",
  },
];
