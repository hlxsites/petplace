import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { CheckoutResolvedData } from "./GetCheckoutUseCase";

export class MockGetCheckoutUseCase implements GetCheckoutRepository {
  query = async (): Promise<CheckoutResolvedData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Implement the mock data
    return null;
  };
}
