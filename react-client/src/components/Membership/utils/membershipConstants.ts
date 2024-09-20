import { MembershipPlan } from "~/domain/useCases/checkout/GetCheckoutUseCase";

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  "Annual Protection",
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
