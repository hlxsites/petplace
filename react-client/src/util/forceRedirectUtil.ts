export function redirectToLostPet() {
  // TODO: this is a temporary implementation for the first public release
  const url =
    "https://mph-qay.pethealthinc.com/external/petplacelogin?redirect=petplace/auth/report/pet";
  window.open(url);
}

export function forceRedirect(uri: string) {
  window.location.href = uri;
}
