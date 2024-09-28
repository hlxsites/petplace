import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountDetailsRepository } from "~/domain/repository/user/AccountDetailsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { AccountDetailsUseCase } from "./AccountDetailsUseCase";
import { MockAccountDetailsCase } from "./MockAccountDetailsUseCase";

export default function accountDetailsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): AccountDetailsRepository {
  if (ENABLE_MOCK) return new MockAccountDetailsCase();

  return new AccountDetailsUseCase(authToken, httpClient);
}
