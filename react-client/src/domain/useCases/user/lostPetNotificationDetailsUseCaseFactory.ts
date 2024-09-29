import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationDetailsRepository } from "~/domain/repository/user/GetLostPetNotificationDetailsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetLostPetNotificationDetailsUseCase } from "./GetLostPetNotificationDetailsUseCase";
import { MockGetLostPetNotificationDetailsUseCase } from "./MockGetLostPetNotificationDetailsUseCase";

export default function accountDetailsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetLostPetNotificationDetailsRepository {
  if (ENABLE_MOCK) return new MockGetLostPetNotificationDetailsUseCase();

  return new GetLostPetNotificationDetailsUseCase(authToken, httpClient);
}
