// Images are hosted on SharePoint on the following folder:
// https://adobe.sharepoint.com/sites/HelixProjects/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FHelixProjects%2FShared%20Documents%2Fsites%2Fpetplace%2Fimages%2Freact&viewid=124ad5f1%2D60ba%2D476c%2Dade8%2D7c1df274ee95

// In order to use new images on the project, upload them to the SharePoint folder and update the filename here

export const ASSET_IMAGES = {
  // Services
  petMedInfoFees: getImageUrl("pet-med-info-fees.jpg"),
  wdAnnualMembership: getImageUrl("wd-annual-membership.jpg"),

  // Tags
  byteTagRoundWhiteDog: getImageUrl("byte-tag-round-white-dog.jpg"),
  byteTagRoundBlackDog: getImageUrl("byte-tag-round-black-dog.jpg"),
  byteTagRoundBlackCat: getImageUrl("byte-tag-round-black-cat.jpg"),
  byteTagSlideBlackLarge: getImageUrl("byte-tag-slide-black-large.jpg"),
  byteTagSlideBlackSmall: getImageUrl("byte-tag-slide-black-small.jpg"),

  catAvatar: getImageUrl("cat-avatar.svg"),
  comfyDogAndCat: getImageUrl("onboarding-comfy-dog-and-cat.png"),
  dogAvatar: getImageUrl("dog-avatar.svg"),
  friendlyDogAndCat: getImageUrl("onboarding-friendly-dog-and-cat.png"),
  insuranceImage: getImageUrl("insurance-image.png"),
  petServices: getImageUrl("onboarding-pet-services.png"),
  petServicesSm: getImageUrl("onboarding-pet-services-sm.png"),
  petPlaceLogo: getImageUrl("pet-place-logo.png"),
  petcoLogo: getImageUrl("petco-logo.png"),
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
  squareCatAvatar: getImageUrl("square-cat-placeholder.jpg"),
  squareDogAvatar: getImageUrl("square-dog-placeholder.jpg"),
  roverLogo: getImageUrl("rover-logo.png"),
};

function getImageUrl(filename: string) {
  const baseURL = "https://www.petplace.com/images/react/";
  return `${baseURL}${filename}`;
}
