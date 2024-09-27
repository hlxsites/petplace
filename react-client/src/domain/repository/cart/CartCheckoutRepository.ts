import { CommonCartItem } from "~/domain/models/cart/CartModel";

export interface CartCheckoutRepository {
  post(data?: CommonCartItem[], petId?: string): Promise<boolean>;
  query(): Promise<CommonCartItem[] | null>;
}
