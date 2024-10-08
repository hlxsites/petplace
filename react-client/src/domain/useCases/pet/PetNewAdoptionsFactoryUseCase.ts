import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetNewAdoptionsRepository } from "~/domain/repository/pet/PetNewAdoptionsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { PetNewAdoptionsMockUseCase } from "./PetNewAdoptionsMockUseCase";
import { PetNewAdoptionsUseCase } from "./PetNewAdoptionsUseCase";

export default function PetNewAdoptionsFactoryUseCase(
  authToken: string,
  httpClient?: HttpClientRepository
): PetNewAdoptionsRepository {
  if (ENABLE_MOCK) return new PetNewAdoptionsMockUseCase();

  return new PetNewAdoptionsUseCase(authToken, httpClient);
}
