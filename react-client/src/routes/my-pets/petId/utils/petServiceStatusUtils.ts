import { PetProduct, PetServices } from "~/domain/models/pet/PetModel";
import { MembershipStatus, PetServiceTypes } from "../types/PetServicesTypes";

function getProductStatus(products?: PetProduct[]) {
  return products ? products.some((product) => product.isExpired) : false;
}

export function getStatus(petServiceStatus: PetServices) {
  const isAnyProductExpired = getProductStatus(petServiceStatus.products);
  if (isAnyProductExpired) return "expired";

  const Statuses: Record<MembershipStatus, PetServiceTypes> = {
    "Annual member": "annual",
    "Lifetime protect member": "lifetime",
    "Lifetime protect member Plus": "lifetimePlus",
    "Not a member": "standard",
  };

  const statusKey = petServiceStatus.membershipStatus as MembershipStatus;

  return Statuses[statusKey] ?? "standard";
}
