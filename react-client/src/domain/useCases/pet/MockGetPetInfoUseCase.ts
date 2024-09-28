import { GetPetInfoRepository } from "~/domain/repository/pet/GetPetInfoRepository";
import { PetModel } from "../../models/pet/PetModel";

import { PETS_LIST } from "./mocks/petsListMock";

export class MockGetPetInfoUseCase implements GetPetInfoRepository {
  query = async (petId: string): Promise<PetModel | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return PETS_LIST.find((pet) => pet.id === petId) ?? null;
  };
}
