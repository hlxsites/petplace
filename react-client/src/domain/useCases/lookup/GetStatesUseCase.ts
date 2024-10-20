import { z } from "zod";
import { CountryStateModel } from "~/domain/models/lookup/CountryStateModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetStatesRepository } from "~/domain/repository/lookup/GetStatesRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetStatesUseCase implements GetStatesRepository {
  private httpClient: HttpClientRepository;
  private cache = new Map<string, CountryStateModel[]>();

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (countryId: string): Promise<CountryStateModel[]> => {
    // The server expects "US" instead of "USA"
    const id = countryId === "USA" ? "US" : countryId;

    // Use cache to avoid unnecessary requests on the same country
    const cached = this.cache.get(id);
    if (cached) return cached;

    try {
      const result = await this.httpClient.get(`lookup/state?country=${id}`);
      if (result.data) {
        const list = parseStatesFromServer(result.data);
        this.cache.set(id, list);
        return list;
      }
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
