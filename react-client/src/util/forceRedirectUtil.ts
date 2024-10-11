import { redirectToMph } from "./mphRedirectUtil";

export function redirectToLostPet() {
  // TODO: this is a temporary implementation for the first public release
  const url = redirectToMph("auth/report/pet");
  window.open(url);
}

export function forceRedirect(uri: string) {
  window.location.href = uri;
}

export function forceReload() {
  window.location.reload();
}
