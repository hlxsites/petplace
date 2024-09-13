import { PetCommon } from "../../models/pet/PetModel";

export interface GetPetsListRepository {
  query(): Promise<PetCommon[]>;
}
