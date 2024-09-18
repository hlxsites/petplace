import { CheckoutModel } from "~/domain/models/checkout/CheckoutModel";

export interface GetCheckoutAvailableProductsRepository {
  query(petId: string): Promise<CheckoutModel | null>;
}
