export const ASSET_IMAGES = {
  comfyDogAndCat: getImageUrl("onboarding-comfy-dog-and-cat.png"),
  friendlyDogAndCat: getImageUrl("onboarding-friendly-dog-and-cat.png"),
  petServices: getImageUrl("onboarding-pet-services.png"),
  petServicesSm: getImageUrl("onboarding-pet-services-sm.png"),
  petPlaceLogo: getImageUrl("pet-place-logo.png"),
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
};

function getImageUrl(filename: string) {
  return new URL(`./images/${filename}`, import.meta.url).href;
}
