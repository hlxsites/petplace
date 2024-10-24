import { z } from "zod";
import { PetModel } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetsListRepository } from "~/domain/repository/pet/GetPetsListRepository";
import { logError, logWarning } from "~/infrastructure/telemetry/logUtils";
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

  query = async (): Promise<PetModel[]> => {
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

function convertToPetModelList(data: unknown): PetModel[] {
  // Data should be an array of pets
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    Age: z.string().nullish(),
    Breed: z.string().nullish(),
    CountryCode: z.union([z.literal("US"), z.literal("CA")]).nullish(),
    DateOfBirth: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .nullish(),
    Id: z.string(),
    ImageUrl: z.string().nullish(),
    MembershipStatus: z.string().nullish(),
    Microchip: z.string().nullish(),
    MixedBreed: z.boolean().nullish(),
    Name: z.string().nullish(),
    Neutered: z.boolean().nullish(),
    PolicyNumbers: z.array(z.string()).nullish(),
    Products: z.array(
      z.object({
        Id: z.string(),
        IsExpired: z.boolean(),
        Name: z.string(),
      })
    ),
    Sex: z.string().nullish(),
    Source: z.number().nullish(),
    Species: z.string().nullish(),
    SpeciesId: z.number().nullish(),
  });

  const list: PetModel[] = [];

  data.forEach((petData) => {
    const pet = parseData(serverResponseSchema, petData);

    // If the pet doesn't have a name, it's not a valid pet
    if (!pet?.Name) {
      logWarning("Invalid pet data", petData);
      return;
    }

    const isProtected = pet?.MembershipStatus
      ? pet.MembershipStatus !== "Not a member"
      : false;

    // TODO: this should be a function
    // Apply on PetInfoUseCase as well
    const products = pet.Products.map(
      (product: { Id: string; IsExpired: boolean; Name: string }) => ({
        id: product.Id,
        isExpired: product.IsExpired,
        name: product.Name,
      })
    );

    list.push({
      age: pet.Age ?? undefined,
      breed: pet.Breed ?? undefined,
      dateOfBirth: pet.DateOfBirth ?? undefined,
      id: pet.Id,
      img: pet.ImageUrl ?? undefined,
      isProtected,
      locale: pet.CountryCode,
      membershipStatus: pet.MembershipStatus ?? undefined,
      microchip: pet.Microchip,
      mixedBreed: pet.MixedBreed ?? undefined,
      name: pet.Name,
      products,
      policyInsurance: pet.PolicyNumbers ?? [],
      sex: pet.Sex ?? undefined,
      sourceType: pet.Source === 1 ? "PetPoint" : "MyPetHealth",
      spayedNeutered: !!pet.Neutered,
      species: pet.Species ?? undefined,
      speciesId: pet.SpeciesId,
    });
  });

  return list;
}
