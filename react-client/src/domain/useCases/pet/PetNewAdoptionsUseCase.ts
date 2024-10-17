import { z } from "zod";
import { PetInAdoptionList } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetNewAdoptionsRepository } from "~/domain/repository/pet/PetNewAdoptionsRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class PetNewAdoptionsUseCase implements PetNewAdoptionsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<PetInAdoptionList[]> => {
    try {
      const result = await this.httpClient.get("api/Pet/new-adoptions");

      if (result.data) return convertToPetModelList(result.data);

      return [];
    } catch (error) {
      logError("PetNewAdoptionsUseCase query error", error);
      return [];
    }
  };
}

function convertToPetModelList(data: unknown): PetInAdoptionList[] {
  // Data should be an array of pets
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    CheckoutUrl: z.string().nullish(),
    Id: z.string(),
    ImageUrl: z.string().nullish(),
    MembershipStatus: z.string().nullish(),
    Microchip: z.string().nullish(),
    Name: z.string().nullish(),
    PetProfileUrl: z.string().nullish(),
  });

  const list: PetInAdoptionList[] = [];

  data.forEach((petData) => {
    const pet = parseData(serverResponseSchema, petData);

    if (!pet) return;

    const isProtected = pet?.MembershipStatus
      ? pet.MembershipStatus !== "Not a member"
      : false;

    list.push({
      id: pet.Id,
      isCheckoutAvailable: !!pet.CheckoutUrl,
      isProfileAvailable: !!pet.PetProfileUrl,
      isProtected,
      microchip: pet.Microchip,
      name: pet.Name ?? "",
      img: pet.ImageUrl ?? undefined,
    });
  });

  return list;
}
