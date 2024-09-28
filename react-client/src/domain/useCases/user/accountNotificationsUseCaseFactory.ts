import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountNotificationRepository } from "~/domain/repository/user/AccountNotificationRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { AccountNotificationsUseCase } from "./AccountNotificationsUseCase";
import { MockAccountNotificationsUseCase } from "./MockAccountNotificationsUseCase";

export default function accountNotificationsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): AccountNotificationRepository {
  if (ENABLE_MOCK) return new MockAccountNotificationsUseCase();

  return new AccountNotificationsUseCase(authToken, httpClient);
}
