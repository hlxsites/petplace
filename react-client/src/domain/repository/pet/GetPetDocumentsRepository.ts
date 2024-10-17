import {
  PetDocument,
  QueryDocumentsInput,
} from "~/domain/models/pet/PetDocument";

export interface GetPetDocumentsRepository {
  query(input: QueryDocumentsInput): Promise<PetDocument[]>;
}
