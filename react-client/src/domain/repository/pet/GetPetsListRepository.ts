import { PetCommon } from "~/domain/models/pet/PetModel";

export interface GetPetsListRepository {
  query(): Promise<PetCommon[]>;
}
