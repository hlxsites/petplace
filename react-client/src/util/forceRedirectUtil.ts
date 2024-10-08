import { redirectToMph } from "./mphRedirectUtil";

export function redirectToLostPet() {
  // TODO: this is a temporary implementation for the first public release
  const url = redirectToMph("petplace/auth/report/pet");
  window.open(url);
}

export function forceRedirect(uri: string) {
  window.location.href = uri;
}
