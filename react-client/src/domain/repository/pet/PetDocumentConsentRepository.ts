import { PetDocumentConsentMutationInput } from "~/domain/models/pet/PetDocument";

export interface PetDocumentConsentRepository {
  mutate(data: PetDocumentConsentMutationInput): Promise<boolean[]>;
}
