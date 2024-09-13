import { PetRecord } from "~/domain/models/pet/PetRecords";

export interface GetPetDocumentsRepository {
  query(petId: string): Promise<PetRecord[]>;
}
