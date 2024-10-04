import { ASSET_IMAGES } from "~/assets";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "../types/PetServicesTypes";

export const PET_WATCH_COMMON_OPTIONS: PetCardPetWatchProps[] = [
  {
    label: "Lost Pet Recovery Specialists",
    id: "recovery-specialists",
  },
  { label: "DirectConnect", id: "direct-connect" },
  { label: "24PetMedAlert", id: "PetMedInfo Fees", icon: "file" },
  {
    label: "24/7 Vet Helpline",
    id: "WD Annual Membership",
    icon: "downloadEmail",
  },
  {
    label: "Customized Pet Training",
    id: "customized-pet-training",
    icon: "downloadEmail",
  },
  {
    label: "Lifetime Warranty ID Tag",
    id: "lifetime-warranty-iD-tag",
    icon: "downloadEmail",
  },
];

const PET_WATCH_LIFETIME_PLUS_OPTIONS: PetCardPetWatchProps[] = [
  ...PET_WATCH_COMMON_OPTIONS,
  {
    imgBrand: ASSET_IMAGES.roverLogo,
    imgLabel: "Rover logo",
    label: "$30 Rover Discount",
    id: "rover-discount",
  },
  {
    imgLabel: "Petco logo",
    imgBrand: ASSET_IMAGES.petcoLogo,
    label: "$25 Petco Coupon",
    id: "petco-coupon",
  },
];

const PET_WATCH_ANNUAL_AVAILABLE_OPTIONS: PetCardPetWatchProps[] = [
  { label: "DirectConnect", id: "direct-connect" },
  { label: "24PetMedAlert", id: "PetMedInfo Fees", icon: "file" },
  {
    label: "24/7 Vet Helpline",
    id: "WD Annual Membership",
    icon: "downloadEmail",
  },
];

export const PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS: PetCardPetWatchProps[] =
  PET_WATCH_LIFETIME_PLUS_OPTIONS.filter(
    (option) => option.id !== "direct-connect"
  ).map((item) => ({
    ...item,
    isDisabled: true,
  }));

const PET_WATCH_NOT_STANDARD_OPTIONS: PetCardPetWatchProps[] =
  PET_WATCH_COMMON_OPTIONS.map((option) => ({
    ...option,
    isDisabled: true,
  }));

export const PetWatchOptionBasedOnMembershipStatus_US: Record<
  MembershipStatus,
  PetCardPetWatchProps[]
> = {
  "Annual member": PET_WATCH_ANNUAL_AVAILABLE_OPTIONS,
  "Lifetime protect member": PET_WATCH_COMMON_OPTIONS,
  "Lifetime protect member Plus": PET_WATCH_LIFETIME_PLUS_OPTIONS,
  "Not a member": PET_WATCH_NOT_STANDARD_OPTIONS,
};

export const PetWatchOptionBasedOnMembershipStatus_CA: Record<
  CA_MembershipStatus,
  PetCardPetWatchProps[]
> = {
  "Lifetime protect member": PET_WATCH_LIFETIME_PLUS_OPTIONS.filter(
    (item) => item.id !== "petco-coupon"
  ),
  "Lifetime protect member Plus": PET_WATCH_LIFETIME_PLUS_OPTIONS,
  "Not a member": PET_WATCH_NOT_STANDARD_OPTIONS,
};
