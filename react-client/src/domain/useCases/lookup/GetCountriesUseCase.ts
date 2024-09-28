import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetCountriesRepository } from "../../repository/lookup/GetCountriesRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetCountriesUseCase implements GetCountriesRepository {
  private httpClient: HttpClientRepository;
  private endpoint: string = "lookup/country";

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<string[] | []> => {
    try {
      const result = await this.httpClient.get(this.endpoint);
      if (result.data) return validateCountries(result.data);

      return [];
    } catch (error) {
      console.error("GetCountriesUseCase query error", error);
      return [];
    }
  };
}

function validateCountries(data: unknown): string[] | [] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.array(z.string()).nullish();

  const countriesData = parseData(serverResponseSchema, data);
  if (!countriesData) return [];

  return countriesData;
}
