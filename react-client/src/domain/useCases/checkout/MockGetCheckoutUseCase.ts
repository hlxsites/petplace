import { CheckoutQueryReturnData } from "~/domain/checkout/CheckoutModels";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { MEMBERSHIP_INFO_OPTIONS } from "./utils/checkoutHardCodedData";

export class MockGetCheckoutUseCase implements GetCheckoutRepository {
  query = async (): Promise<CheckoutQueryReturnData> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      plans: Object.values(MEMBERSHIP_INFO_OPTIONS),
    };
  };
}
