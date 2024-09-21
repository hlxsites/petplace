import { PetServices } from "~/domain/models/pet/PetModel";
import { MembershipStatus } from "~/routes/my-pets/petId/types/PetServicesTypes";
import { PetWatchOptionBasedOnMembershipStatus_US } from "~/routes/my-pets/petId/utils/petWatchConstants";

export function getPetWatchServiceOption(
  serviceStatus: PetServices["membershipStatus"]
) {
  return (
    PetWatchOptionBasedOnMembershipStatus_US[
      serviceStatus as MembershipStatus
    ] || PetWatchOptionBasedOnMembershipStatus_US["Not a member"]
  );
}

export function shouldRenderStandardServiceDrawer(
  serviceStatus: PetServices["membershipStatus"]
) {
  return serviceStatus === "Not a member" || null;
}
