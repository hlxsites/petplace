import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountNotificationPreferencesRepository } from "~/domain/repository/user/AccountNotificationRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { AccountNotificationPreferencesUseCase } from "./AccountNotificationPreferencesUseCase";
import { MockAccountNotificationPreferencesUseCase } from "./MockAccountNotificationPreferencesUseCase";

export default function accountNotificationPreferencesUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): AccountNotificationPreferencesRepository {
  if (ENABLE_MOCK) return new MockAccountNotificationPreferencesUseCase();

  return new AccountNotificationPreferencesUseCase(authToken, httpClient);
}
