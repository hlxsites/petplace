import { IconKeys } from "~/components/design-system";

export type PetServiceOffer = {
  buttonLabel: string;
  icon?: IconKeys;
  message: string;
};

export type PetServiceStatuses = "active" | "expired" | "standard";

export type PetServiceTypes =
  | "annual"
  | "expired"
  | "lifetime"
  | "lifetimePlus"
  | "standard";

export type MembershipStatus =
  | "Annual member"
  | "Lifetime protect member"
  | "Lifetime protect member Plus"
  | "Not a member";

export type CA_MembershipStatus = Exclude<MembershipStatus, "Annual member">;
