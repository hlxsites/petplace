import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { GetCheckoutUseCase } from "./GetCheckoutUseCase";
import { MockGetCheckoutUseCase } from "./MockGetCheckoutUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetCheckoutRepository {
  if (ENABLE_MOCK) return new MockGetCheckoutUseCase();

  return new GetCheckoutUseCase(authToken, httpClient);
}
