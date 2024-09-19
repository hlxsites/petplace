import { CheckoutModel } from "~/domain/models/checkout/CheckoutModel";
import { GetCheckoutAvailableProductsRepository } from "~/domain/repository/checkout/GetCheckoutAvailableProductsRepository";

export class MockGetCheckoutAvailableProductsUseCase
  implements GetCheckoutAvailableProductsRepository
{
  query = async (): Promise<CheckoutModel | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implement the mock data
    return null;
  };
}
