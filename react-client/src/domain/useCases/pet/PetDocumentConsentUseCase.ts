import { PetDocumentConsentMutationInput } from "~/domain/models/pet/PetDocument";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetDocumentConsentRepository } from "~/domain/repository/pet/PetDocumentConsentRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class PetDocumentConsentUseCase implements PetDocumentConsentRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  mutate = async ({
    consent,
    microchips,
  }: PetDocumentConsentMutationInput): Promise<boolean[]> => {
    const fnToLoop = this.mutateOne(consent);

    // The server only handles one mutation at a time,
    // so we loop through the list and await each mutation
    const result = await Promise.allSettled(microchips.map(fnToLoop));
    return result.map((r) => r.status === "fulfilled" && r.value);
  };

  mutateOne = (consent: boolean) => {
    return async (microchip: string): Promise<boolean> => {
      if (!microchip) return false;

      // TODO: for phase 2 we are implementing only the microchip case, used as PetId
      const payload = {
        PetId: microchip,
        PetIdType: 0,
        ShelterDocumentConsent: consent,
      };

      try {
        const response = await this.httpClient.post(
          "adopt/api/User/pet-document-consent",
          {
            body: JSON.stringify(payload),
          }
        );

        return !!response.success;
      } catch (error) {
        logError("Error while sending pet document consent", error);
      }
      return false;
    };
  };
}
