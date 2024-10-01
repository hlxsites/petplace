import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountEmergencyContactsRepository } from "~/domain/repository/user/AccountEmergencyContactsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { AccountEmergencyContactsUseCase } from "./AccountEmergencyContactsUseCase";
import { MockAccountEmergencyContactUseCase } from "./MockAccountEmergencyContactsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): AccountEmergencyContactsRepository {
  if (ENABLE_MOCK) return new MockAccountEmergencyContactUseCase();

  return new AccountEmergencyContactsUseCase(authToken, httpClient);
}
