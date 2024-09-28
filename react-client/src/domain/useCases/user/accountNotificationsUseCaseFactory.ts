import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountNotificationRepository } from "~/domain/repository/user/GetAccountNotificationRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetAccountNotificationsUseCase } from "./GetAccountNotificationsUseCase";
import { MockGetAccountNotificationsUseCase } from "./MockGetAccountNotificationsUseCase";

export default function accountNotificationsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountNotificationRepository {
  if (ENABLE_MOCK) return new MockGetAccountNotificationsUseCase();

  return new GetAccountNotificationsUseCase(authToken, httpClient);
}
