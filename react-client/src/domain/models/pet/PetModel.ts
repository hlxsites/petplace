export type MissingStatus = "missing" | "found";
export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";


type ContactDone = {
  date: number;
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
  date: number;
  update: number;
  status: MissingStatus;
  id: number;
  note?: string;
  foundedBy?: FoundedByInfo | null;
};

export type PetModel = {
  age?: string | undefined;
  breed?: string;
  dateOfBirth?: string;
  id: string;
  img?: string;
  isProtected?: boolean;
  microchip?: string | null;
  mixedBreed?: string;
  name: string;
  onboardCompleted?: boolean;
  sex?: string;
  spayedNeutered?: boolean;
  species?: string;
  documentationStatus?: DocumentationStatus;
  missingStatus?: MissingStatus;
  lostPetHistory?: LostPetUpdate[];
};