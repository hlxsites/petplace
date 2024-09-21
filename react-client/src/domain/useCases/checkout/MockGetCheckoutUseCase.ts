import { CheckoutQueryReturnData } from "~/domain/checkout/CheckoutModels";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";

export class MockGetCheckoutUseCase implements GetCheckoutRepository {
  query = async (): Promise<CheckoutQueryReturnData> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Implement the mock data
    return {
      actionButtons: [],
      plans: [],
    };
  };
}
