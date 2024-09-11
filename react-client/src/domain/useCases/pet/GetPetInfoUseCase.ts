import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetModel } from "../../models/pet/PetModel";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { GetPetInfoRepository } from "~/domain/repository/pet/GetPetInfoRepository";
import { z } from "zod";
import { parseData } from "../util/parseData";

export class GetPetInfoUseCase implements GetPetInfoRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError(error: unknown): null {
    console.error("GetPetInfoUseCase query error", error);
    return null;
  }

  async query(petId: string): Promise<PetModel | null> {
    try {
      const result = await this.httpClient.get(`Pet/${petId}`);

      if (result.data) return convertToPetModelInfo(result.data);

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

function convertToPetModelInfo(data: unknown): PetModel | null {
  if (!data || typeof data !== "object") return null;

  const serverResponseSchema = z.object({
    Age: z.string(),
    Breed: z.string(),
    DateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    Id: z.string(),
    MembershipStatus: z.string().nullish(),
    Microchip: z.string().nullish(),
    MixedBreed: z.boolean(),
    Name: z.string(),
    Neutered: z.boolean(),
    Sex: z.string(),
    Species: z.string(),
  });

  const info = parseData(serverResponseSchema, data);

  if (!info) return null;

  return {
    age: info.Age,
    breed: info.Breed,
    dateOfBirth: info.DateOfBirth,
    id: info.Id,
    microchip: info.Microchip,
    mixedBreed: info.MixedBreed,
    name: info.Name,
    sex: info.Sex,
    spayedNeutered: info.Neutered,
    species: info.Species,
  };
}
