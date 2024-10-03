import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostPetImageRepository } from "~/domain/repository/pet/PostPetImageRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { PostPetImageUseCase } from "./PostPetImageUseCase";
import { MockPostPetImageUseCase } from "./MockPostPetImageUseCase";

export default function postPetImageUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): PostPetImageRepository {
  if (ENABLE_MOCK) return new MockPostPetImageUseCase();

  return new PostPetImageUseCase(authToken, httpClient);
}
