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
