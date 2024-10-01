import { z } from "zod";
import { CountryStateModel } from "~/domain/models/lockup/CountryStateModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { GetStatesRepository } from "../../repository/lookup/GetStatesRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetStatesUseCase implements GetStatesRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (countryId: string): Promise<CountryStateModel[]> => {
    try {
      // The server expects "US" instead of "USA"
      const id = countryId === "USA" ? "US" : countryId;
      const result = await this.httpClient.get(`lookup/state?country=${id}`);
      if (result.data) return parseStatesFromServer(result.data);
    } catch (error) {
      logError("GetStatesUseCase query error", error);
    }
    return [];
  };
}

function parseStatesFromServer(data: unknown): CountryStateModel[] {
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
      z.object({ stateId: z.string().nullish(), name: z.string().nullish() })
    )
    .nullish();

  const statesData = parseData(serverResponseSchema, transformedData);
  if (!statesData) return [];

  const list: CountryStateModel[] = [];

  statesData.forEach((state) => {
    if (state.stateId && state.name) {
      list.push({
        id: state.stateId,
        title: state.name,
      });
    }
  });

  return list;
}
