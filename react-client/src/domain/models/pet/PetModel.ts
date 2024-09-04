export type MissingStatus = "missing" | "found";
export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

export type LostPetUpdate = {
  date: number;
  update: number;
  status: MissingStatus;
  id: number;
  note?: string;
};

export type PetModel = {
  age?: string | undefined;
  breed?: string;
  dateOfBirth?: string;
  id: string;
  img?: string;
  isProtected?: boolean;
  microchip?: string;
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
