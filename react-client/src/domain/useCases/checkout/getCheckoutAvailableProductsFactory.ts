import { GetCheckoutAvailableProductsRepository } from "~/domain/repository/checkout/GetCheckoutAvailableProductsRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetCheckoutAvailableProductsUseCase } from "./GetCheckoutAvailableProductsUseCase";
import { MockGetCheckoutAvailableProductsUseCase } from "./MockGetCheckoutAvailableProductsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetCheckoutAvailableProductsRepository {
  if (ENABLE_MOCK) return new MockGetCheckoutAvailableProductsUseCase();

  return new GetCheckoutAvailableProductsUseCase(authToken, httpClient);
}
