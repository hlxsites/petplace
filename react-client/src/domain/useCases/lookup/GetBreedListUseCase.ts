import { z } from "zod";
import {
  BreedModel
} from "~/domain/models/lookup/LookupModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetBreedListRepository } from "~/domain/repository/lookup/GetBreedListRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetBreedListUseCase implements GetBreedListRepository {
  private httpClient: HttpClientRepository;
  private cache = new Map<string, BreedModel[]>();

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (speciesId: number): Promise<BreedModel[]> => {
    const id = speciesId === 1 ? "dog" : "cat";

    const cached = this.cache.get(id);
    if (cached) return cached;

    try {
      const result = await this.httpClient.get(`lookup/breed/${speciesId}`);
      if (result.data) {
        const list = convertToBreedList(result.data);
        this.cache.set(id, list);
        return list;
      }
    } catch (error) {
      logError("GetBreedListUseCase query error", error);
    }
    return [];
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
