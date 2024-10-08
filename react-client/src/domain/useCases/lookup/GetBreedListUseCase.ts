import { z } from "zod";
import { BreedModel } from "~/domain/models/lookup/LookupModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetBreedListRepository } from "~/domain/repository/lookup/GetBreedListRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetBreedListUseCase implements GetBreedListRepository {
  private httpClient: HttpClientRepository;
  private cache: BreedModel[] = [];

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<BreedModel[]> => {
    // Use cache to avoid unnecessary requests
    if (this.cache.length) return this.cache;

    try {
      const result = await this.httpClient.get("lookup/breed");
      if (result.data) return convertToBreedList(result.data);

      return [];
    } catch (error) {
      logError("GetCountriesUseCase query error", error);
      return [];
    }
  };
}

function convertToBreedList(data: unknown): BreedModel[] {
  const transformedData = (() => {
    // The server is returns this request as an string atm
    if (typeof data === "string") {
      try {
        return JSON.parse(data) as unknown;
      } catch (error) {
        logError("convertToBreedList error", error);
        return null;
      }
    }
    return data;
  })();

  const serverResponseSchema = z
    .array(
      z.object({
        id: z.number().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish();

  const breedList: BreedModel[] = [];

  const breedData = parseData(serverResponseSchema, transformedData);
  if (!breedData) return [];

  breedData.forEach(({ id, name }) => {
    if (!id || !name) return;
    breedList.push({ id, name });
  });

  return breedList;
}
