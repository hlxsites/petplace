import { IS_RUNNING_ON_LOCALHOST } from "~/util/envUtil";

const BASE_URL = `${window.location.origin}/images/react/`;

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
  if (IS_RUNNING_ON_LOCALHOST) {
    return new URL(`./images/${filename}`, import.meta.url).href;
  }

  return `${BASE_URL}${filename}`;
}
