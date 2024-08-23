import { ASSET_IMAGES } from "~/assets";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";

export const PET_WATCH_OPTIONS: PetCardPetWatchProps[] = [
  {
    label: "24/7 Lost Pet Support",
    id: "lost-pet-support",
  },
  {
    label: "Lost Pet Recovery Specialists",
    id: "recovery-specialists",
  },
  { label: "DirectConnect", id: "direct-connect" },
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
  { label: "24PetMedAlert", id: "24-pet-med-alert" },
  { label: "24/7 Vet Helpline", id: "vet-helpline" },
  {
    isDisabled: true,
    label: "Customized Pet Training",
    id: "customized-pet-training",
    labelStatus: "Expired",
  },
  { label: "Lifetime Warranty ID Tag", id: "lifetime-warranty-iD-tag" },
];
