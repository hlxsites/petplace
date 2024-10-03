import { Locale } from "../misc/Locale";

export type MissingStatus = "missing" | "found";
export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

type ContactDone = {
  date: string;
  email?: string;
  methodContact?: string;
  phoneNumber?: string;
};

export type FoundedByInfo = {
  contact?: ContactDone[];
  finderName?: string;
  finderOrganization?: string;
  finderPhoneNumber?: string;
  name?: string;
};

export type LostPetUpdate = {
  date: string;
  update: string;
  status: MissingStatus;
  id: number;
  note?: string;
  foundedBy?: FoundedByInfo | null;
};

export type LostAndFountNotification = {
  date: string;
  update: string;
  status: MissingStatus;
  id: number;
  note: string;
}

export type PetCommon = {
  id: string;
  img?: string;
  isProtected?: boolean;
  microchip?: string | null;
  name: string;
};

export type PetProduct = {
  id: string;
  isExpired: boolean;
  name: string;
};

export type PetServices = {
  locale?: Locale | null;
  membershipStatus?: string;
  products?: PetProduct[];
};

export type PetModel = PetCommon &
  PetServices & {
    age?: string | undefined;
    breed?: string;
    dateOfBirth?: string;
    documentationStatus?: DocumentationStatus;
    lostPetHistory?: LostPetUpdate[];
    missingStatus?: MissingStatus;
    mixedBreed?: boolean;
    onboardCompleted?: boolean;
    policyInsurance?: string[];
    sex?: string;
    sourceType?: "MyPetHealth" | "PetPoint";
    spayedNeutered?: boolean;
    species?: string;
  };
