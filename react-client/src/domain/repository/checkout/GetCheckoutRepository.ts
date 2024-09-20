import { CheckoutResolvedData } from "~/domain/useCases/checkout/GetCheckoutUseCase";

export interface GetCheckoutRepository {
  query(petId: string): Promise<CheckoutResolvedData | null>;
}
