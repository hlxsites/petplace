import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountDetailsRepository } from "~/domain/repository/user/GetAccountDetailsRepository";
import { IS_DEV_ENV } from "~/util/envUtil";
import { GetAccountDetailsUseCase } from "./GetAccountDetailsUseCase";
import { MockGetUserUseCase } from "./MockGetAccountDetailsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetAccountDetailsRepository {
  if (IS_DEV_ENV) return new MockGetUserUseCase();

  return new GetAccountDetailsUseCase(authToken, httpClient);
}
