import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";

import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";
import { GetProductsUseCase } from "./GetProductsUseCase";
import { MockGetProductsUseCase } from "./MockGetProductsUseCase";

export default function getProductsFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetProductsRepository {
  if (ENABLE_MOCK) return new MockGetProductsUseCase();

  return new GetProductsUseCase(authToken, httpClient);
}
