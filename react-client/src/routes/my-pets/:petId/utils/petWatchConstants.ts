import { ASSET_IMAGES } from "~/assets";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";

export const PET_WATCH_OPTIONS: PetCardPetWatchProps[] = [
  {
    label: "24/7 Lost Pet Support",
  },
  {
    label: "Lost Pet Recovery Specialists",
  },
  { label: "DirectConnect" },
  {
    imgBrand: ASSET_IMAGES.roverLogo,
    imgLabel: "Rover logo",
    label: "$30 Rover Discount",
  },
  {
    imgLabel: "Petco logo",
    imgBrand: ASSET_IMAGES.petcoLogo,
    label: "$25 Petco Coupon",
  },
  { label: "24PetMedAlert" },
  { label: "24/7 Vet Helpline" },
  {
    isDisabled: true,
    label: "Customized Pet Training",
    labelStatus: "Expired",
  },
  { label: "Lifetime Warranty ID Tag" },
];
