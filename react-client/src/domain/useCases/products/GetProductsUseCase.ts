import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";
import {
  Colors,
  ProductDescription,
  Sizes,
} from "~/domain/models/products/ProductModel";
import { ADDITIONAL_PRODUCTS } from "./utils/productsHardCodedData";

export class GetProductsUseCase implements GetProductsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError = (error: unknown): null => {
    console.error("GetProductsUseCase query error", error);
    return null;
  };

  query = async (petId: string): Promise<ProductDescription[] | null> => {
    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      if (result.data) return convertToProductModelInfo(result.data);

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

function convertToProductModelInfo(data: unknown): ProductDescription[] | null {
  if (!data || typeof data !== "object") return null;

  const productSchema = z.array(
    z.object({
      Color: z.string().nullish(),
      ItemId: z.string().nullish(),
      ItemName: z.string().nullish(),
      Price: z.string().nullish(),
      Size: z.string().nullish(),
      SpeciesId: z.string().nullish(),
      UIName: z.string().nullish(),
    })
  );

  const serverResponseSchema = z.object({
    MembershipProducts: z.record(z.string(), z.unknown()),
  });

  const parsedData = parseData(serverResponseSchema, data);

  if (!parsedData?.MembershipProducts) return null;

  const products: ProductDescription[] = [];

  Object.keys(parsedData.MembershipProducts).forEach((key) => {
    if (key.toLowerCase().includes("annual")) {
      const annualProduct = parsedData.MembershipProducts[key] as Record<
        string,
        unknown
      > | null;

      if (!annualProduct) return null;

      const additionalProductList = annualProduct?.["AdditionalProductList"] as
        | Record<string, unknown>[]
        | null;

      if (!additionalProductList) return null;

      additionalProductList?.forEach((item) => {
        const id = item.ItemId as string;
        const description = ADDITIONAL_PRODUCTS[id];

        products.push({
          id,
          description,
          price: `$${item.Price}`,
          title: item.UIName as string,
        });
      });
    }
    if (key.toLowerCase() === "tags") {
      const filteredProductByteTag = (
        parsedData.MembershipProducts[key] as Record<string, unknown>
      )["ByteTag"];

      if (filteredProductByteTag) {
        const productsData = parseData(productSchema, filteredProductByteTag);

        if (!productsData) return null;

        productsData.forEach((item) => {
          const availableColors = item.Color
            ? ([item.Color.toLocaleLowerCase()] as Colors[])
            : null;
          const availableSizes = convertSizeToProductSize(item.Size);

          products.push({
            availableColors,
            availableSizes,
            id: item.ItemId,
            price: `$${item.Price}`,
            title: item.ItemName,
          });
        });
      }
    }
  });

  return products;
}

function convertSizeToProductSize(size?: string | null): Sizes[] {
  const sizeMapping: Record<string, Sizes[]> = {
    "Small/Medium": ["S/M"],
    Large: ["L"],
    Small: ["S"],
    "": ["One Size"],
  };
  return sizeMapping[size || ""] || ["One Size"];
}
