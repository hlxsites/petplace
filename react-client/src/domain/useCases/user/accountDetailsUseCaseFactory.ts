import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountDetailsRepository } from "~/domain/repository/user/GetAccountDetailsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetAccountDetailsUseCase } from "./GetAccountDetailsUseCase";
import { MockGetAccountDetailsCase } from "./MockGetAccountDetailsUseCase";

export default function accountDetailsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountDetailsRepository {
  if (ENABLE_MOCK) return new MockGetAccountDetailsCase();

  return new GetAccountDetailsUseCase(authToken, httpClient);
}
