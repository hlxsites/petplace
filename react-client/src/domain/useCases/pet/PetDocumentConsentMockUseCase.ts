import { PetDocumentConsentMutationInput } from "~/domain/models/pet/PetDocument";
import { PetDocumentConsentRepository } from "~/domain/repository/pet/PetDocumentConsentRepository";

export class PetDocumentConsentMockUseCase
  implements PetDocumentConsentRepository
{
  private cache = false;
  async mutate({
    microchips,
  }: PetDocumentConsentMutationInput): Promise<boolean[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.cache = !this.cache;
    return microchips.map(() => this.cache);
  }
}
