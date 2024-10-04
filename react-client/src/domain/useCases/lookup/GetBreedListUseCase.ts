import { z } from "zod";
import { BreedModel } from "~/domain/models/lookup/LookupModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetBreedListRepository } from "~/domain/repository/lookup/GetBreedListRepository";
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
    if (this.cache) return this.cache;

    try {
      const result = await this.httpClient.get("lookup/breed");
      if (result.data) return convertToBreedList(result.data);

      return [];
    } catch (error) {
      console.error("GetCountriesUseCase query error", error);
      return [];
    }
  };
}

function convertToBreedList(data: unknown): BreedModel[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z
    .array(
      z.object({
        id: z.number().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish();

  const breedList: BreedModel[] = [];

  const breedData = parseData(serverResponseSchema, data);
  if (!breedData) return [];

  breedData.forEach(({ id, name }) => {
    if (!id || !name) return;
    breedList.push({ id, name });
  });

  return breedList;
}
