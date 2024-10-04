import { DetailedCartItem } from "~/domain/models/products/ProductModel";

export interface GetProductsRepository {
  query(petId: string, plan: string): Promise<DetailedCartItem[] | null>;
}
