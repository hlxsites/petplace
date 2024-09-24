// Images are hosted on SharePoint on the following folder:
  // https://adobe.sharepoint.com/sites/HelixProjects/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FHelixProjects%2FShared%20Documents%2Fsites%2Fpetplace%2Fimages%2Freact&viewid=124ad5f1%2D60ba%2D476c%2Dade8%2D7c1df274ee95

  // In order to use new images on the project, upload them to the SharePoint folder and update the filename here

export const ASSET_IMAGES = {
  catAvatar: getImageUrl("cat-avatar.svg"),
  comfyDogAndCat: getImageUrl("onboarding-comfy-dog-and-cat.png"),
  dogAvatar: getImageUrl("dog-avatar.svg"),
  friendlyDogAndCat: getImageUrl("onboarding-friendly-dog-and-cat.png"),
  petServices: getImageUrl("onboarding-pet-services.png"),
  petServicesSm: getImageUrl("onboarding-pet-services-sm.png"),
  petPlaceLogo: getImageUrl("pet-place-logo.png"),
  petcoLogo: getImageUrl("petco-logo.png"),
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
  roverLogo: getImageUrl("rover-logo.png"),
};

function getImageUrl(filename: string) {
  const baseURL = `${window.location.origin}/images/react/`;
  return `${baseURL}${filename}`;
}
