import { Locale } from "../misc/Locale";

export type MissingStatus = "missing" | "found" | "unknown";
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
  id: number;
  note: string;
  status: MissingStatus;
  statusMessage: string;
  update: string;
};

export type PetCommon = {
  id: string;
  img?: string;
  isProtected?: boolean;
  microchip?: string | null;
  name: string;
  speciesId?: number | null;
};

export type PetInAdoptionList = PetCommon & {
  isCheckoutAvailable: boolean;
  isProfileAvailable: boolean;
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
