import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";

export class MockCartCheckoutUseCase implements CartCheckoutRepository {
  post = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
