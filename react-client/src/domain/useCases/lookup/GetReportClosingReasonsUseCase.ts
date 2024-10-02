import { z } from "zod";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { GetReportClosingReasonsRepository } from "../../repository/lookup/GetReportClosingReasonsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetReportClosingReasonsUseCase implements GetReportClosingReasonsRepository {
  private httpClient: HttpClientRepository;
  private endpoint: string = "/lookup/resolvereason";

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<ReportClosingReasonModel[]> => {
    try {
      const result = await this.httpClient.get(this.endpoint);
      if (result.data) {
        // the server is returning the value as a string, so first we need to parse it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedResult = JSON.parse(result.data as string)
        return validateStates(parsedResult);}

      return [];
    } catch (error) {
      logError("GetReportClosingReasonsUseCase query error", error);
      return [];
    }
  };
}

function validateStates(data: unknown): ReportClosingReasonModel[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z
    .array(
      z
        .object({ id: z.number().nullish(), name: z.string().nullish() })
        .nullish()
    )
    .nullish();

  const statesData = parseData(serverResponseSchema, data);
  if (!statesData) return [];

  const reasonsList: ReportClosingReasonModel[] = [];

  statesData.forEach((state) => {
    if (state)
      reasonsList.push({ id: state.id ?? 0, reason: state.name ?? "" });
  });

  return reasonsList;
}
