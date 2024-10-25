import { z } from "zod";
import {
  MissingStatus,
  PetModel,
  PetMutateInput,
} from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetInfoRepository } from "~/domain/repository/pet/PetInfoRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

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
  InsuranceAggregatorUrl: z.string().nullish(),
  IsMissing: z.boolean().nullish(),
  MembershipStatus: z.string().nullish(),
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
  Sex: z.string().nullish(),
  Source: z.number().nullish(),
  Species: z.string().nullish(),
  SpeciesId: z.number().nullish(),
});

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

      if (!result.success) {
        const petPointProfiles = await this.queryPetPointProfile();

        if (petPointProfiles) {
          return petPointProfiles.find((pet) => pet.id === petId) ?? null;
        }
        return null;
      }

      if (result.data) return convertToPetModelInfo(result.data);

      return null;
    } catch (error) {
      logError("PetInfoUseCase query error", error);
      return null;
    }
  };

  queryPetPointProfile = async (): Promise<PetModel[] | null> => {
    try {
      const result = await this.httpClient.get("api/Pet");

      if (result.data) return convertToPetPointPetModelInfo(result.data);

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

function getPetProducts(
  products: { Id: string; IsExpired: boolean; Name: string }[]
) {
  return products.map(({ Id, IsExpired, Name }) => ({
    id: Id,
    isExpired: IsExpired,
    name: Name,
  }));
}

function convertToPetPointPetModelInfo(data: unknown): PetModel[] {
  // Data should be an array of pets
  if (!data || !Array.isArray(data)) return [];

  const list: PetModel[] = [];

  data.forEach((petData) => {
    const pet = parseData(serverResponseSchema, petData);

    if (!pet) return [];

    const products = getPetProducts(pet.Products);

    list.push({
      age: pet.Age ?? undefined,
      breed: pet.Breed ?? undefined,
      dateOfBirth: pet.DateOfBirth ?? undefined,
      id: pet.Id,
      img: pet.ImageUrl ?? undefined,
      insuranceUrl: pet.InsuranceAggregatorUrl ?? "",
      locale: pet.CountryCode,
      membershipStatus: pet.MembershipStatus ?? undefined,
      microchip: pet.Microchip,
      mixedBreed: !!pet.MixedBreed,
      name: pet.Name,
      policyInsurance: pet.PolicyNumbers ?? [],
      products,
      sex: pet.Sex ?? undefined,
      sourceType: pet.Source === 1 ? "PetPoint" : "MyPetHealth",
      spayedNeutered: !!pet.Neutered,
      species: pet.Species ?? undefined,
      speciesId: pet.SpeciesId,
    });
  });
  return list;
}

function convertToPetModelInfo(data: unknown): PetModel | null {
  if (!data || typeof data !== "object") return null;

  const info = parseData(serverResponseSchema, data);

  if (!info) return null;

  const products = getPetProducts(info.Products);

  const missingStatus: MissingStatus = (() => {
    if (typeof info.IsMissing === "boolean") {
      return info.IsMissing ? "missing" : "found";
    }
    return "unknown";
  })();

  return {
    age: info.Age ?? undefined,
    breed: info.Breed ?? undefined,
    dateOfBirth: info.DateOfBirth ?? undefined,
    id: info.Id,
    img: info.ImageUrl ?? undefined,
    insuranceUrl: info.InsuranceAggregatorUrl ?? "",
    locale: info.CountryCode,
    membershipStatus: info.MembershipStatus ?? undefined,
    microchip: info.Microchip,
    missingStatus,
    mixedBreed: !!info.MixedBreed,
    name: info.Name,
    policyInsurance: info.PolicyNumbers ?? [],
    products,
    sex: info.Sex ?? undefined,
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
