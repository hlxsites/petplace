import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetInfoRepository } from "~/domain/repository/pet/GetPetInfoRepository";
import { PetModel } from "../../models/pet/PetModel";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
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

  private handleError = (error: unknown): null => {
    console.error("GetPetInfoUseCase query error", error);
    return null;
  };

  query = async (petId: string): Promise<PetModel | null> => {
    try {
      const result = await this.httpClient.get(`api/Pet/${petId}`);

      if (result.data) return convertToPetModelInfo(result.data);

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

function convertToPetModelInfo(data: unknown): PetModel | null {
  if (!data || typeof data !== "object") return null;

  const serverResponseSchema = z.object({
    Age: z.string(),
    Breed: z.string(),
    CountryCode: z.union([z.literal("US"), z.literal("CA")]).nullish(),
    DateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    Id: z.string(),
    ImageUrl: z.string().nullish(),
    MembershipStatus: z.string(),
    Microchip: z.string().nullish(),
    MixedBreed: z.boolean().nullish(),
    Name: z.string(),
    Neutered: z.boolean().nullish(),
    Products: z.array(
      z.object({
        Id: z.string(),
        IsExpired: z.boolean(),
        Name: z.string(),
      })
    ),
    Sex: z.string(),
    Source: z.number().nullish(),
    Species: z.string(),
  });

  const info = parseData(serverResponseSchema, data);

  if (!info) return null;

  const products = info.Products.map(
    (product: { Id: string; IsExpired: boolean; Name: string }) => ({
      id: product.Id,
      isExpired: product.IsExpired,
      name: product.Name,
    })
  );

  return {
    age: info.Age,
    breed: info.Breed,
    dateOfBirth: info.DateOfBirth,
    id: info.Id,
    img: info.ImageUrl ?? undefined,
    locale: info.CountryCode,
    membershipStatus: info.MembershipStatus,
    microchip: info.Microchip,
    mixedBreed: !!info.MixedBreed,
    name: info.Name,
    products,
    sex: info.Sex,
    sourceType: info.Source === 1 ? "MyPetHealth" : "PetPoint",
    spayedNeutered: !!info.Neutered,
    species: info.Species,
  };
}
