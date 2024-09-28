import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountEmergencyContactsRepository } from "~/domain/repository/user/GetAccountEmergencyContactsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetAccountEmergencyContactsUseCase } from "./GetAccountEmergencyContactsUseCase";
import { MockGetAccountEmergencyContactUseCase } from "./MockGetAccountEmergencyContactsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountEmergencyContactsRepository {
  if (ENABLE_MOCK) return new MockGetAccountEmergencyContactUseCase();

  return new GetAccountEmergencyContactsUseCase(authToken, httpClient);
}
