import { ASSET_IMAGES } from "~/assets";
import { MoreInfoDetailed } from "~/domain/models/products/ProductModel";

export const PRODUCT_DESCRIPTION: Record<string, string> = {
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
  "ByteTag-Black R Dog": [],
  "ByteTag-Black-S-Sm/M": [
    ASSET_IMAGES.byteTagSlideBlackSmall,
    ASSET_IMAGES.byteTagSlideBlackLarge,
  ],
  "ByteTag-Black-S-Lg": [],
  "ByteTag-White R Dog": [
    ASSET_IMAGES.byteTagRoundBlackDog,
    ASSET_IMAGES.byteTagRoundWhiteDog,
  ],
  "ByteTag-Black R Cat": [ASSET_IMAGES.byteTagRoundBlackCat],
};

const vetHelpLineDescriptions = {
  additionalInfo:
    "Your first year is complimentary with a Lifetime Protection Membership.",
};

const petMedAlert = {
  additionalInfo:
    "Your first year is complimentary with a Lifetime Protection Membership.",
};

const byteTagSlide = {
  privacyFeatures:
    "You can choose to hide your phone number and address from your pet's profile until your pet has been marked as lost.",
  tagFeatures: [
    "Waterproof",
    "Scratch, bite, and fade resistant",
    "Light weight and jingle free",
    "No batteries needed",
    "Compatible with all smartphones",
    "No monthly fee",
    "Can be used anywhere and anytime",
  ],
};

const byteTagRound = {
  privacyFeatures:
    "You can choose to hide your phone number and address from your pet's profile until your pet has been marked as lost.",
  tagFeatures: [
    "Waterproof",
    "Scratch, bite, and fade resistant",
    "Light weight and jingle free",
    "No batteries needed",
    "Compatible with all smartphones",
    "No monthly fee",
    "Can be used anywhere and anytime",
  ],
};

export const PRODUCT_DETAILS: Record<string, MoreInfoDetailed> = {
  "ByteTag ": byteTagRound,
  "ByteTag Slide Black ": byteTagSlide,
  "PetMedInfo Fees": petMedAlert,
  "WD Annual Membership": vetHelpLineDescriptions,
};