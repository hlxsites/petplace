import { PetModel } from "~/domain/models/pet/PetModel";
import { GetPetsListRepository } from "~/domain/repository/pet/GetPetsListRepository";
import { PETS_LIST } from "./mocks/petsListMock";

export class MockGetPetsListUseCase implements GetPetsListRepository {
  async query(): Promise<PetModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return PETS_LIST;
  }
}
