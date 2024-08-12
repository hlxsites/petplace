export const ASSET_IMAGES = {
  petcoLogo: getImageUrl("petco-logo.png"),
  petWatchLogo: getImageUrl("24-pet-watch-logo.png"),
  roverLogo: getImageUrl("rover-logo.png"),
};

function getImageUrl(filename: string) {
  return new URL(`./images/${filename}`, import.meta.url).href;
}
