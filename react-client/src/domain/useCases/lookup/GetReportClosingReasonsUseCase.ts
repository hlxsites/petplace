import { z } from "zod";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { GetReportClosingReasonsRepository } from "../../repository/lookup/GetReportClosingReasonsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetReportClosingReasonsUseCase
  implements GetReportClosingReasonsRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<ReportClosingReasonModel[]> => {
    try {
      const result = await this.httpClient.get("/lookup/resolvereason");
      if (result.data) {
        return readResolveReasonOptions(result.data);
      }
    } catch (error) {
      logError("GetReportClosingReasonsUseCase query error", error);
    }
    return [];
  };
}

function readResolveReasonOptions(data: unknown): ReportClosingReasonModel[] {
  const transformedData = (() => {
    // The server is returns this request as an string atm
    if (typeof data === "string") {
      try {
        return JSON.parse(data) as unknown;
      } catch (error) {
        logError("parseStatesFromServer error", error);
        return null;
      }
    }
    return data;
  })();

  const serverResponseSchema = z
    .array(
      z
        .object({ id: z.number().nullish(), name: z.string().nullish() })
        .nullish()
    )
    .nullish();

  const statesData = parseData(serverResponseSchema, transformedData);
  if (!statesData) return [];

  const reasonsList: ReportClosingReasonModel[] = [];

  statesData.forEach((state) => {
    if (state)
      reasonsList.push({ id: state.id ?? 0, reason: state.name ?? "" });
  });

  return reasonsList;
}
