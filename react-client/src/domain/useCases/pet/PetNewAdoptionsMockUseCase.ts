import { PetModel } from "~/domain/models/pet/PetModel";
import { PetNewAdoptionsRepository } from "~/domain/repository/pet/PetNewAdoptionsRepository";
import { PETS_LIST } from "./mocks/petsListMock";

export class PetNewAdoptionsMockUseCase implements PetNewAdoptionsRepository {
  async query(): Promise<PetModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return PETS_LIST;
  }
}
