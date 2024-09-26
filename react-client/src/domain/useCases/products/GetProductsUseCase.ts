import { z } from "zod";
import { ProductDescription } from "~/domain/models/products/ProductModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetProductsRepository } from "~/domain/repository/products/GetProductsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
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

  query = async (
    petId: string,
    plan: string
  ): Promise<ProductDescription[] | null> => {
    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      if (result.data) return convertToProductsList(result.data, plan);

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

function convertToProductsList(
  data: unknown,
  plan: string
): ProductDescription[] | null {
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
    // This is a hardcoded check for the annual plan
    // It should't be doing that on the FE code, but it's a requirement for now
    if (key.toLowerCase().includes("annual") && key === plan) {
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
        const id = typeof item.ItemId === "string" ? item.ItemId : null;
        const price = typeof item.Price === "string" ? item.Price : null;
        const title = typeof item.UIName === "string" ? item.UIName : null;

        // Skip if any of the required fields are missing
        if (!id || !title || !price) return;

        const description = ADDITIONAL_PRODUCTS[id];
        products.push({
          availableColors: [],
          availableSizes: [],
          availableOptions: {
            default: {
              id,
              price,
            },
          },
          id,
          description,
          title,
          images: [],
        });
      });
    }

    // Hardcoded check for ByteTag products, also something we want to refactor in the future
    if (key.toLowerCase() === "tags") {
      const filteredProductByteTag = (
        parsedData.MembershipProducts[key] as Record<string, unknown>
      )["ByteTag"];

      if (filteredProductByteTag) {
        const productsData = parseData(productSchema, filteredProductByteTag);

        if (!productsData) return null;

        const productsMap = new Map<string, ProductDescription>();

        const uniqueArray = (arr: string[]) => Array.from(new Set(arr));

        productsData.forEach((item) => {
          const fullProductName = item.ItemName;
          const id = item.ItemId;
          const price = item.Price;
          if (!fullProductName || !id || !price) return;

          const [productName] = fullProductName.split("-");
          const color = item?.Color?.toLowerCase() || "unknown";
          const size = convertSizeToProductSize(item.Size);
          const productColorSizeKey = `${color}|${size}`;

          if (productsMap.has(productName)) {
            // Add color and size to existing product
            const product = productsMap.get(productName);
            if (!product) return;

            productsMap.set(productName, {
              ...product,
              availableColors: uniqueArray([...product.availableColors, color]),
              availableSizes: uniqueArray([...product.availableSizes, size]),
              availableOptions: {
                ...product.availableOptions,
                [productColorSizeKey]: {
                  id,
                  price,
                },
              },
            });
          } else {
            // Create new product
            productsMap.set(productName, {
              availableColors: [color],
              availableSizes: [size],
              availableOptions: {
                [productColorSizeKey]: {
                  id,
                  price,
                },
              },
              // We are using the product name as the id for this kind of products
              id: productName,
              // TODO: connect hard coded images hosted on the SharePoint
              images: [],
              title: productName,
            });
          }
        });

        products.push(...Array.from(productsMap.values()));
      }
    }
  });

  return products;
}

function convertSizeToProductSize(size?: string | null): string {
  if (!size) return "One Size";

  const lowercaseSize = size.toLowerCase();
  if (lowercaseSize === "small/medium") return "S/M";
  if (lowercaseSize === "large") return "L";
  if (lowercaseSize === "small") return "S";

  return lowercaseSize;
}
