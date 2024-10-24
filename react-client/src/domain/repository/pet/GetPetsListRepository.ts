import { PetModel } from "~/domain/models/pet/PetModel";

export interface GetPetsListRepository {
  query(): Promise<PetModel[]>;
}
