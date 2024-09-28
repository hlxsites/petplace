import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationsRepository } from "~/domain/repository/user/GetLostPetNotificationsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetLostPetNotificationsUseCase } from "./GetLostPetNotificationsUseCase";
import { MockGetLostPetNotificationsUseCase } from "./MockGetLostPetNotificationsUseCase";

export default function accountDetailsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetLostPetNotificationsRepository {
  if (ENABLE_MOCK) return new MockGetLostPetNotificationsUseCase();

  return new GetLostPetNotificationsUseCase(authToken, httpClient);
}
