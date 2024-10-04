import { PetModel } from "~/domain/models/pet/PetModel";
import { PutPetInfoRequest } from "~/domain/useCases/pet/PetInfoUseCase";

export interface PetInfoRepository {
  query(petId: string): Promise<PetModel | null>;
  mutate(data: PutPetInfoRequest): Promise<boolean>;
}
