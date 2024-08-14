export const ASSET_IMAGES = {
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
  comfyDogAndCat: getImageUrl("onboarding-comfy-dog-and-cat.png"),
  petPlaceLogo: getImageUrl("pet-place-logo.png"),
};

function getImageUrl(filename: string) {
  return new URL(`./images/${filename}`, import.meta.url).href;
}
