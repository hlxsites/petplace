import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";

import { MockCartCheckoutUseCase } from "./MockCartCheckoutUseCase";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";
import { CartCheckoutUseCase } from "./CartCheckoutUseCase";

export default function getCartCheckoutFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): CartCheckoutRepository {
  if (ENABLE_MOCK) return new MockCartCheckoutUseCase();

  return new CartCheckoutUseCase(authToken, httpClient);
}
