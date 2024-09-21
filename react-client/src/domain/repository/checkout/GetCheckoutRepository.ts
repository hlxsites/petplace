import { CheckoutQueryReturnData } from "~/domain/checkout/CheckoutModels";

export interface GetCheckoutRepository {
  query(petId: string): Promise<CheckoutQueryReturnData | null>;
}
