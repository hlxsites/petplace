import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostAndFoundNotificationsRepository } from "~/domain/repository/pet/GetLostAndFoundNotificationsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetLostAndFoundNotificationsUseCase } from "./GetLostAndFoundNotificationsUseCase";
import { MockGetLostAndFoundNotificationsUseCase } from "./MockGetLostAndFoundNotificationsUseCase";

export default function getLostAndFoundNotificationsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetLostAndFoundNotificationsRepository {
  if (ENABLE_MOCK) return new MockGetLostAndFoundNotificationsUseCase();

  return new GetLostAndFoundNotificationsUseCase(authToken, httpClient);
}
