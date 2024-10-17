import { PetServices } from "~/domain/models/pet/PetModel";

export function shouldRenderStandardServiceDrawer(
  serviceStatus: PetServices["membershipStatus"]
) {
  return serviceStatus === "Not a member" || null;
}
