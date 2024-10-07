import { z } from "zod";
import { PetCommon } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetsListRepository } from "~/domain/repository/pet/GetPetsListRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetPetsListUseCase implements GetPetsListRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<PetCommon[]> => {
    try {
      const result = await this.httpClient.get("api/Pet");

      if (result.data) return convertToPetModelList(result.data);

      return [];
    } catch (error) {
      logError("GetPetsListUseCase query error", error);
      return [];
    }
  };
}

function convertToPetModelList(data: unknown): PetCommon[] {
  // Data should be an array of pets
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    Id: z.string(),
    ImageUrl: z.string().nullish(),
    MembershipStatus: z.string().nullish(),
    Microchip: z.string().nullish(),
    Name: z.string(),
  });

  const list: PetCommon[] = [];

  data.forEach((petData) => {
    const pet = parseData(serverResponseSchema, petData);

    if (!pet) return;

    const isProtected = pet?.MembershipStatus
      ? pet.MembershipStatus !== "Not a member"
      : false;

    list.push({
      id: pet.Id,
      isProtected,
      microchip: pet.Microchip,
      name: pet.Name,
      img: pet.ImageUrl ?? undefined,
    });
  });

  return list;
}
