import {
  PetDocument,
  PetDocumentTypeId,
} from "~/domain/models/pet/PetDocument";

export interface GetPetDocumentsRepository {
  query(petId: string, type: PetDocumentTypeId): Promise<PetDocument[]>;
}
