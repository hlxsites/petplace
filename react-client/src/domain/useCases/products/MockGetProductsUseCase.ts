import {
  Colors,
  ProductDescription,
  Sizes,
} from "~/domain/models/products/ProductModel";
import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";

export class MockGetProductsUseCase implements GetProductsRepository {
  query = async (): Promise<ProductDescription[] | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const products: ProductDescription[] = [
      {
        availableColors: ["black"] as Colors[],
        availableSizes: null,
        id: "ByteTag-Black R Cat",
        title: "ByteTag - Black Round Cat",
        price: "$19.95",
      },
      {
        availableColors: ["black"] as Colors[],
        availableSizes: ["L"] as Sizes[],
        id: "ByteTag-Black-S-Lg",
        title: "ByteTag Slide Black - Lg",
        price: "$19.95",
      },
      {
        availableColors: ["black"] as Colors[],
        availableSizes: ["S/M"] as Sizes[],
        id: "ByteTag-Black-S-Sm/M",
        title: "ByteTag Slide Black - sm/M",
        price: "$19.95",
      },
    ];
    return products;
  };
}
