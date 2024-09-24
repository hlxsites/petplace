import { ProductDescription } from "~/domain/models/products/ProductModel";

export interface GetProductsRepository {
  query(petId: string): Promise<ProductDescription[] | null>;
}
