import { QueryCartItem } from "~/domain/models/cart/CartModel";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";

export class MockCartCheckoutUseCase implements CartCheckoutRepository {
  query = async (): Promise<QueryCartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        autoRenew: false,
        id: "Test id",
        petId: "Test pet id",
        quantity: 1,
      },
    ];
  };

  post = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
