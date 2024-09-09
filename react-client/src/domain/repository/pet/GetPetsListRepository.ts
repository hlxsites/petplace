import { PetModel } from "../../models/pet/PetModel";

export interface GetPetsListRepository {
  query(): Promise<PetModel[]>;
}
