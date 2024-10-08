import { PetCommon } from "~/domain/models/pet/PetModel";

export interface PetNewAdoptionsRepository {
  query(): Promise<PetCommon[]>;
}
