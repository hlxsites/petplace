import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetCheckoutUseCase } from "./GetCheckoutUseCase";
import { MockGetCheckoutUseCase } from "./MockGetCheckoutUseCase";

export default function getCheckoutFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetCheckoutRepository {
  if (ENABLE_MOCK) return new MockGetCheckoutUseCase();

  return new GetCheckoutUseCase(authToken, httpClient);
}
