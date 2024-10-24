import { ProductDescription } from "~/domain/models/products/ProductModel";
import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";

export class MockGetProductsUseCase implements GetProductsRepository {
  query = async (): Promise<ProductDescription[] | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const products: ProductDescription[] = [
      {
        availableColors: ["black"],
        availableSizes: ["One Size"],
        availableOptions: {
          "black|One Size": {
            id: "ByteTag-Black R Cat",
            price: "19.95",
          },
        },
        id: "ByteTag-Black",
        images: [],
        title: "ByteTag Round Cat",
        type: "TagProduct",
      },
      {
        availableColors: ["black", "white"],
        availableSizes: ["S/M", "L"],
        availableOptions: {
          "black|S/M": {
            id: "ByteTag-Black-S-Sm/M",
            price: "19.95",
          },
          "white|S/M": {
            id: "ByteTag-White-S-Sm/M",
            price: "19.95",
          },
          "black|L": {
            id: "ByteTag-Black-L",
            price: "15.95",
          },
        },
        id: "ByteTag-Black",
        images: [],
        title: "ByteTag Slide",
        type: "TagProduct",
      },
    ];
    return products;
  };
}
