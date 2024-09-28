import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetStatesRepository } from "../../repository/lookup/GetStatesRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetStatesUseCase implements GetStatesRepository {
  private httpClient: HttpClientRepository;
  private endpoint = (country: string) => `lookup/state?country=${country}`;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (country: string): Promise<string[]> => {
    try {
      const result = await this.httpClient.get(this.endpoint(country));
      if (result.data) return validateStates(result.data);

      return [];
    } catch (error) {
      console.error("GetStatesUseCase query error", error);
      return [];
    }
  };
}

function validateStates(data: unknown): string[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z
    .array(
      z
        .object({ stateId: z.string().nullish(), name: z.string().nullish() })
        .nullish()
    )
    .nullish();

  const statesData = parseData(serverResponseSchema, data);
  if (!statesData) return [];

  return statesData.map((state) => (state && state.name ? state.name : ""));
}
