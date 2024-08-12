export const ASSET_IMAGES = {
  comfyDogAndCat: getImageUrl("onboarding-comfy-dog-and-cat.png"),
  petPlaceLogo: getImageUrl("pet-place-logo.png"),
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
};

function getImageUrl(filename: string) {
  return new URL(`./images/${filename}`, import.meta.url).href;
}
