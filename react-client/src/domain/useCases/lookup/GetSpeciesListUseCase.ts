import { z } from "zod";
import { SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetSpeciesListRepository } from "~/domain/repository/lookup/GetSpeciesListRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetSpeciesListUseCase implements GetSpeciesListRepository {
  private httpClient: HttpClientRepository;
  private cache: SpeciesModel[] = [];

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<SpeciesModel[]> => {
    // Use cache to avoid unnecessary requests
    if (this.cache) return this.cache;

    try {
      const result = await this.httpClient.get("lookup/species");
      if (result.data) return convertToSpeciesList(result.data);

      return [];
    } catch (error) {
      console.error("GetSpeciesListUseCase query error", error);
      return [];
    }
  };
}

function convertToSpeciesList(data: unknown): SpeciesModel[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z
    .array(
      z.object({
        id: z.number().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish();

  const speciesList: SpeciesModel[] = [];

  const speciesData = parseData(serverResponseSchema, data);
  if (!speciesData) return [];

  speciesData.forEach(({ id, name }) => {
    if (!id || !name) return;
    speciesList.push({ id, name });
  });

  return speciesList;
}
