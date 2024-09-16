import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountDetailsRepository } from "~/domain/repository/user/GetAccountDetailsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetAccountDetailsUseCase } from "./GetAccountDetailsUseCase";
import { MockGetUserUseCase } from "./MockGetAccountDetailsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountDetailsRepository {
  if (ENABLE_MOCK) return new MockGetUserUseCase();

  return new GetAccountDetailsUseCase(authToken, httpClient);
}
