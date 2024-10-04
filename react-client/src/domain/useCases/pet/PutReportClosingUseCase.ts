import { z } from "zod";
import { ReportClosingModel } from "~/domain/models/pet/ReportClosingModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PutReportClosingRepository } from "~/domain/repository/pet/PutReportClosingRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

const serverResponseSchema = z.object({
  PetId: z.string(),
  MicrochipNumber: z.string().nullish(),
  ResolveReason: z.number().nullish(),
});

type PutServerSchema = z.infer<typeof serverResponseSchema>

export class PutReportClosingUseCase implements PutReportClosingRepository {
  private httpClient: HttpClientRepository;
  private endpoint = "/api/LostFound/lostpetreport";

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError = (error: unknown): false => {
    logError("PostPetImageUseCase query error", error);
    return false;
  };

  mutate = async (data: ReportClosingModel): Promise<boolean> => {
    const body = convertToServerSchema(data);
    const isValid = serverResponseSchema.safeParse(body).success

    try {
      if (isValid) {
        const result = await this.httpClient.put(
        this.endpoint,
        {
          body: JSON.stringify(body),
        }
      );
      console.log("🚀 ~ result", result)

      if (result.data) return result.data as boolean;
    }


      return false;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

function convertToServerSchema (data: ReportClosingModel): PutServerSchema{
     return {
      PetId: data.petId,
      MicrochipNumber: data.microchip,
      ResolveReason: data.reason,
    }
}