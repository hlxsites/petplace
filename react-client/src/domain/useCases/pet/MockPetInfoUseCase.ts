import { PetInfoRepository } from "~/domain/repository/pet/PetInfoRepository";
import { PetModel } from "../../models/pet/PetModel";

import { PETS_LIST } from "./mocks/petsListMock";
import { PutPetInfoRequest } from "./PetInfoUseCase";

export class MockPetInfoUseCase implements PetInfoRepository {
  query = async (petId: string): Promise<PetModel | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return PETS_LIST.find((pet) => pet.id === petId) ?? null;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async mutate(_data: PutPetInfoRequest): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  }
}
