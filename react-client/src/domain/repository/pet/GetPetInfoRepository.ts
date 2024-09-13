import { PetModel } from "../../models/pet/PetModel";

export interface GetPetInfoRepository {
  query(petId: string): Promise<PetModel | null>;
}
