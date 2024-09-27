import {
  MembershipDescriptionOffer,
  MembershipInfo,
  MembershipPlanId,
} from "~/domain/checkout/CheckoutModels";

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

export const MEMBERSHIP_INFO_OPTIONS: Record<MembershipPlanId, MembershipInfo> =
  {
    AnnualProduct: {
      buttonLabel: "Get 1 Year Protection",
      comparePlansButtonLabel: "Get Annual",
      id: "AnnualProduct",
      membershipDescriptionOffers: ANNUAL_LIST_OFFERS,
      price: "$45.95",
      priceInfo: "For the first year, $19.95/year thereafter",
      subTitle: "Keep Your Pet Safe All Year",
      title: "Annual Protection",
      type: "AnnualProduct",
    },
    PLH_000007: {
      buttonLabel: "Get the Best Value",
      comparePlansButtonLabel: "Get Lifetime",
      id: "PLH_000007",
      isHighlighted: true,
      infoFooter: "* Complimentary for 1 year",
      membershipDescriptionOffers: LIFETIME_LIST_OFFERS,
      price: "$99.95",
      priceInfo: "One-time fee",
      subTitle: "The Best Value Lost Pet Protection",
      title: "abc",
      type: "LPMProduct",
    },
    LPMPLUSProduct: {
      buttonLabel: "Unlock Complete Care",
      comparePlansButtonLabel: "Get Lifetime +",
      id: "LPMPLUSProduct",
      infoFooter: "* Complimentary for 1 year",
      membershipDescriptionOffers: MEMBERSHIP_LIST_OFFERS,
      price: "$199.95",
      priceInfo: "One-time fee",
      subTitle: "Complete Lost Pet Protection",
      title: "lif +",
      type: "LPMPLUSProduct",
    },
  };

type CompareType = {
  availableColumns: string[];
  label: string;
  title: string;
};

const ALL_PLANS = ["AnnualMembership", "LPMMembership", "LPMPlusMembership"];
const ONLY_LIFETIME_PLANS = ["LPMMembership", "LPMPlusMembership"];

export const MEMBERSHIP_COMPARE_PLANS: CompareType[] = [
  {
    availableColumns: ALL_PLANS,
    label:
      "Quickly report a lost or found pet through the portal or our Customer Service Representatives.",
    title: "Access to Portal",
  },
  {
    availableColumns: ALL_PLANS,
    label:
      "Get access to specialists who can quickly launch the process of finding your pet.",
    title: "Lost Pet Support",
  },
  {
    availableColumns: ALL_PLANS,
    label: "Connect with your pet's finder and arrange a quick, safe reunion.",
    title: "DirectConnect",
  },
  {
    availableColumns: ONLY_LIFETIME_PLANS,
    label:
      "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
    title: "24/7 VetHelpline",
  },
  {
    availableColumns: ONLY_LIFETIME_PLANS,
    label:
      "Critical medical and behavioral information will be relayed to the shelter or vet when found.",
    title: "24PetMedAlert®",
  },
  {
    availableColumns: ONLY_LIFETIME_PLANS,
    label: "Save on pet-sitting and dog-walking services from Rover.com.",
    title: "$30 Rover Coupon",
  },
  {
    availableColumns: ONLY_LIFETIME_PLANS,
    label:
      "Redeem for in-store purchases at Petco with Petco Vital Care member sign-up.",
    title: "$25 Petco Coupon",
  },
  {
    availableColumns: ["LPMPlusMembership"],
    label:
      "Get an ID tag customized with your pet’s name and unique microchip number.",
    title: "Lifetime Warranty ID Tag",
  },
  {
    availableColumns: ["LPMPlusMembership"],
    label: "Simple, easy to follow lessons for you and your pet.",
    title: "Petcademy",
  },
];
