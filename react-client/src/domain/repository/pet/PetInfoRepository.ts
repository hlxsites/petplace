import { PetModel, PetMutateInput } from "~/domain/models/pet/PetModel";

export interface PetInfoRepository {
  query(petId: string): Promise<PetModel | null>;
  mutate(data: PetMutateInput): Promise<boolean>;
}
