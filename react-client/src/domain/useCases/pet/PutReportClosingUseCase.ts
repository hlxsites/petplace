import { ReportPetFoundMutationInput } from "~/domain/models/pet/ReportClosingModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PutReportClosingRepository } from "~/domain/repository/pet/PutReportClosingRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class PutReportClosingUseCase implements PutReportClosingRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  mutate = async (data: ReportPetFoundMutationInput): Promise<boolean> => {
    const body = {
      PetId: data.petId,
      MicrochipNumber: data.microchip,
      ResolveReason: data.reason,
    };

    try {
      const result = await this.httpClient.put("/api/LostFound/lostpetreport", {
        body: JSON.stringify(body),
      });
      return !!result.success;
    } catch (error) {
      logError("PostPetImageUseCase query error", error);
    }
    return false;
  };
}
