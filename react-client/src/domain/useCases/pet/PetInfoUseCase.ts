import { z } from "zod";
import { PetModel, PetMutateInput } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetInfoRepository } from "~/domain/repository/pet/PetInfoRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class PetInfoUseCase implements PetInfoRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (petId: string): Promise<PetModel | null> => {
    try {
      const result = await this.httpClient.get(`api/Pet/${petId}`);

      if (result.data) return convertToPetModelInfo(result.data);

      return null;
    } catch (error) {
      logError("PetInfoUseCase query error", error);
      return null;
    }
  };

  mutate = async (pet: PetMutateInput): Promise<boolean> => {
    try {
      const body = convertToServerPetInfo(pet);
      const result = await this.httpClient.put("api/Pet", {
        body: JSON.stringify(body),
      });

      return (
        !!result.statusCode &&
        result.statusCode >= 200 &&
        result.statusCode < 300
      );
    } catch (error) {
      logError("PetInfoUseCase mutation error", error);
    }
    return false;
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
    InsuranceAggregatorUrl: z.string().nullish(),
    MembershipStatus: z.string(),
    Microchip: z.string().nullish(),
    MixedBreed: z.boolean().nullish(),
    Name: z.string(),
    Neutered: z.boolean().nullish(),
    PolicyNumbers: z.array(z.string()).nullish(),
    Products: z.array(
      z.object({
        Id: z.string(),
        IsExpired: z.boolean(),
        Name: z.string(),
      })
    ),
    Sex: z.string(),
    Source: z.number().nullish(),
    Species: z.string().nullish(),
    SpeciesId: z.number().nullish(),
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
    insuranceUrl: info.InsuranceAggregatorUrl ?? "",
    locale: info.CountryCode,
    membershipStatus: info.MembershipStatus,
    microchip: info.Microchip,
    missingStatus: "found",
    mixedBreed: !!info.MixedBreed,
    name: info.Name,
    policyInsurance: info.PolicyNumbers ?? [],
    products,
    sex: info.Sex,
    sourceType: info.Source === 1 ? "PetPoint" : "MyPetHealth",
    spayedNeutered: !!info.Neutered,
    species: info.Species ?? undefined,
    speciesId: info.SpeciesId,
  };
}

type PetUpdateServerInput = {
  BreedId: number;
  DateOfBirth: string;
  Id: string;
  MixedBreed: boolean;
  Name: string;
  Neutered: boolean;
  Sex: "1" | "2";
  SpeciesId: number;
};

function convertToServerPetInfo(data: PetMutateInput): PetUpdateServerInput {
  return {
    Id: data.id,
    Name: data.name,
    Sex: data.sex === "Male" ? "1" : "2",
    DateOfBirth: data.dateOfBirth ?? "",
    Neutered: !!data.spayedNeutered,
    SpeciesId: data.specieId,
    BreedId: data.breedId,
    MixedBreed: !!data.mixedBreed,
  };
}
