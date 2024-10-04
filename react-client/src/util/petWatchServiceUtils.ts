import { PetServices } from "~/domain/models/pet/PetModel";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "~/routes/my-pets/petId/types/PetServicesTypes";
import {
  PetWatchOptionBasedOnMembershipStatus_CA,
  PetWatchOptionBasedOnMembershipStatus_US,
} from "~/routes/my-pets/petId/utils/petWatchConstants";

export function getPetWatchServiceOption(
  serviceStatus: PetServices["membershipStatus"],
  locale?: PetServices["locale"]
) {
  const PetWatchOptionsBasedOnLocale = {
    US:
      PetWatchOptionBasedOnMembershipStatus_US[
        serviceStatus as MembershipStatus
      ] || PetWatchOptionBasedOnMembershipStatus_US["Not a member"],
    CA: PetWatchOptionBasedOnMembershipStatus_CA[
      (serviceStatus as CA_MembershipStatus) ||
        PetWatchOptionBasedOnMembershipStatus_CA["Not a member"]
    ],
  };

  return PetWatchOptionsBasedOnLocale[locale ?? "US"];
}

export function shouldRenderStandardServiceDrawer(
  serviceStatus: PetServices["membershipStatus"]
) {
  return serviceStatus === "Not a member" || null;
}
