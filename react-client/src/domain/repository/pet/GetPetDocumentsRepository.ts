import { PetDocumentTypeId } from "~/domain/models/pet/PetDocument";
import { PetRecord } from "~/domain/models/pet/PetRecords";

export interface GetPetDocumentsRepository {
  query(petId: string, type: PetDocumentTypeId): Promise<PetRecord[]>;
}
