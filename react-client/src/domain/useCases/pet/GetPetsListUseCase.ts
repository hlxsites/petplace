/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetModel } from "../../models/pet/PetModel";
import { GetPetsListRepository } from "../../repository/pet/GetPetsListRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class GetPetsListUseCase implements GetPetsListRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<PetModel[]> {
    try {
      const result = await this.httpClient.get("Pet");

      if (result.data) return convertToPetModelList(result.data);

      return [];
    } catch (error) {
      console.error("GetPetsListUseCase query error", error);
      return [];
    }
  }
}

function convertToPetModelList(data: unknown): PetModel[] {
  // Data should be an array of pets
  if (!data || !(Array.isArray(data) && data.length)) return [];

  return data.map((pet) => ({
    id: pet.Id,
    isProtected: !!pet.MembershipStatus,
    microchip: pet.Microchip,
    name: pet.Name,
  }));
}
