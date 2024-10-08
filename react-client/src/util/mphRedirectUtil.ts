import { PETPLACE_MPH_BASE_URL } from "./envUtil";

export function redirectToMph(path: string) {
  return `${PETPLACE_MPH_BASE_URL}/external/petplacelogin?redirecturl=${path}`;
}
