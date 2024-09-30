import { ASSET_IMAGES } from "~/assets";

export const ADDITIONAL_PRODUCTS: Record<string, string> = {
  "PetMedInfo Fees":
    "Critical medical and behavioral information will be relayed to the shelter or vet when found.",
  "WD Annual Membership":
    "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
};

export const IMAGES_PRODUCTS: Record<string, string[]> = {
  // SERVICES
  "PetMedInfo Fees": [ASSET_IMAGES.petMedInfoFees],
  "WD Annual Membership": [ASSET_IMAGES.wdAnnualMembership],

  // TAGS
  "ByteTag-Black R Dog": [ASSET_IMAGES.byteTagRoundBlackDog],
  "ByteTag-Black-S-Sm/M": [ASSET_IMAGES.byteTagSlideBlackSmall],
  "ByteTag-Black-S-Lg": [ASSET_IMAGES.byteTagSlideBlackLarge],
  "ByteTag-White R Dog": [ASSET_IMAGES.byteTagRoundWhiteDog],
  "ByteTag-Black R Cat": [ASSET_IMAGES.byteTagRoundBlackCat],
};
