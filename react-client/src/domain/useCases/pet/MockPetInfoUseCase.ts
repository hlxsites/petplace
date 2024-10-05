import { PetModel } from "~/domain/models/pet/PetModel";
import { PetInfoRepository } from "~/domain/repository/pet/PetInfoRepository";

import { PETS_LIST } from "./mocks/petsListMock";

export class MockPetInfoUseCase implements PetInfoRepository {
  query = async (petId: string): Promise<PetModel | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return PETS_LIST.find((pet) => pet.id === petId) ?? null;
  };

  async mutate(): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  }
}
