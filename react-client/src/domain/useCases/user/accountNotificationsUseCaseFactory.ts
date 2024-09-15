import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountNotificationRepository } from "~/domain/repository/user/GetAccountNotificationRepository";
import { IS_DEV_ENV } from "~/util/envUtil";
import { GetAccountNotificationUseCase } from "./GetAccountNotificationsUseCase";
import { MockGetAccountNotificationsUseCase } from "./MockGetAccountNotificationsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountNotificationRepository {
  if (IS_DEV_ENV) return new MockGetAccountNotificationsUseCase();

  return new GetAccountNotificationUseCase(authToken, httpClient);
}
