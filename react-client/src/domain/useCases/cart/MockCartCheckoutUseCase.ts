import { CommonCartItem } from "~/domain/models/cart/CartModel";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";

export class MockCartCheckoutUseCase implements CartCheckoutRepository {
  query = async (): Promise<CommonCartItem[] | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "Test id",
        quantity: 1,
        type: "Annual product",
      },
    ];
  };

  post = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
