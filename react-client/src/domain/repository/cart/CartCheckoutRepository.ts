import { AnimalInfo, CartItem } from "~/domain/models/cart/CartModel";

export interface CartCheckoutRepository {
  post(data?: CartItem, animalInfo?: AnimalInfo): Promise<boolean>;
}
