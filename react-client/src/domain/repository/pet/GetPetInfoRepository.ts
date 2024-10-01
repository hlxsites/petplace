import { PutPetInfoRequest } from "~/domain/useCases/pet/GetPetInfoUseCase";
import { PetModel } from "../../models/pet/PetModel";

export interface GetPetInfoRepository {
  query(petId: string): Promise<PetModel | null>;
  mutate(data: PutPetInfoRequest): Promise<boolean>;
}
