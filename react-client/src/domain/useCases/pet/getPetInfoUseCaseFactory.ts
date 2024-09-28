import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetInfoRepository } from "~/domain/repository/pet/GetPetInfoRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetPetInfoUseCase } from "./GetPetInfoUseCase";
import { MockGetPetInfoUseCase } from "./MockGetPetInfoUseCase";

export default function getPetInfoUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetPetInfoRepository {
  if (ENABLE_MOCK) return new MockGetPetInfoUseCase();

  return new GetPetInfoUseCase(authToken, httpClient);
}
