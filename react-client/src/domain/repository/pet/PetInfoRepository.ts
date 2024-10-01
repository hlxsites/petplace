import { PutPetInfoRequest } from "~/domain/useCases/pet/PetInfoUseCase";
import { PetModel } from "../../models/pet/PetModel";

export interface PetInfoRepository {
  query(petId: string): Promise<PetModel | null>;
  mutate(data: PutPetInfoRequest): Promise<boolean>;
}
