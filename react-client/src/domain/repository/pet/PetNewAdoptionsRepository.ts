import { PetInAdoptionList } from "~/domain/models/pet/PetModel";

export interface PetNewAdoptionsRepository {
  query(): Promise<PetInAdoptionList[]>;
}
