import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetInfoRepository } from "~/domain/repository/pet/PetInfoRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { PetInfoUseCase } from "./PetInfoUseCase";
import { MockPetInfoUseCase } from "./MockPetInfoUseCase";

export default function petInfoUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): PetInfoRepository {
  if (ENABLE_MOCK) return new MockPetInfoUseCase();

  return new PetInfoUseCase(authToken, httpClient);
}
