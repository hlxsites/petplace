import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";

import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";
import { MockGetProductsUseCase } from "./MockGetProductsUseCase";
import { GetProductsUseCase } from "./GetProductsUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetProductsRepository {
  if (ENABLE_MOCK) return new MockGetProductsUseCase();

  return new GetProductsUseCase(authToken, httpClient);
}
