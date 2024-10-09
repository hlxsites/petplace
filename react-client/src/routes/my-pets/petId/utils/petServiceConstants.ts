import { TagProps } from "~/components/design-system";
import {
  PetServiceOffer,
  PetServiceStatuses,
  PetServiceTypes,
} from "../types/PetServicesTypes";

const PET_SERVICE_OFFERS: Record<PetServiceStatuses, PetServiceOffer> = {
  active: {
    buttonLabel: "See all my benefits",
    icon: "apps",
    message:
      "Continue to enjoy premium benefits and top-notch care for your pet from or products and partners.",
  },
  expired: {
    icon: "apps",
    buttonLabel: "Renew services",
    message:
      "Renew services to continue enjoying premium benefits and top-notch care for your pet from or products and partners.",
  },
  standard: {
    buttonLabel: "See details",
    message:
      "If your pet ever goes missing and is found, they can be scanned at a vet or animal shelter to identify their microchip number. When the chip number is shared with 24Petwatch, you'll be notified using the consent and information on file. This may include email, automated phone call and SMS. Be sure to keep your contact details up-to-date.",
  },
};

export const PET_WATCH_OFFERS: Record<PetServiceTypes, PetServiceOffer> = {
  annual: PET_SERVICE_OFFERS.active,
  expired: PET_SERVICE_OFFERS.expired,
  lifetime: PET_SERVICE_OFFERS.active,
  lifetimePlus: PET_SERVICE_OFFERS.active,
  standard: PET_SERVICE_OFFERS.standard,
};

export const PET_WATCH_TAGS: Record<PetServiceTypes, TagProps> = {
  annual: { label: "Active Annual Membership", tagStatus: "success" },
  expired: {
    label: "Expired Services",
    tagStatus: "warning",
  },
  lifetime: { label: "Active Lifetime Membership", tagStatus: "success" },
  lifetimePlus: {
    label: "Active Lifetime plus Membership",
    tagStatus: "success",
  },
  standard: { label: "Standard", tagStatus: "info" },
};
