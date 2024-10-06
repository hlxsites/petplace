import { Locale } from "../misc/Locale";

export type MissingStatus = "missing" | "found";
export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

export type ContactDone = {
  date?: string;
  email?: string;
};

export type FoundedByInfo = {
  contact?: ContactDone[];
  finderName?: string;
  finderOrganization?: string;
  finderPhoneNumber?: string;
};

export type LostPetUpdateModel = {
  date: string;
  id: string;
  communicationId: string;
  note?: string;
  petId: string;
  petName: string;
  status: MissingStatus;
  update: string;
  foundedBy?: FoundedByInfo;
};

export type LostAndFountNotification = {
  date: string;
  update: string;
  status: MissingStatus;
  id: number;
  note: string;
};

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
    insuranceUrl?: string;
    missingStatus: MissingStatus;
    mixedBreed?: boolean;
    onboardCompleted?: boolean;
    policyInsurance?: string[];
    sex?: string;
    sourceType?: "MyPetHealth" | "PetPoint";
    spayedNeutered?: boolean;
    species?: string;
  };

export type PetMutateInput = Pick<
  PetModel,
  "dateOfBirth" | "id" | "mixedBreed" | "name" | "sex" | "spayedNeutered"
> & {
  breedId: number;
  specieId: number;
};
