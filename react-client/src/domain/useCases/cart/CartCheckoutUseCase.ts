import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";
import { z } from "zod";
import { parseData } from "../util/parseData";
import { CommonCartItem } from "~/domain/models/cart/CartModel";

const cartItemServerSchema = z.object({
  AnimalId: z.string().nullish(),
  ItemId: z.string().nullish(),
  ItemName: z.string().nullish(),
  ItemType: z.string().nullish(),
  Quantity: z.number().nullish(),
  UnitPrice: z.number().nullish(),
});

const serverSchema = z.object({
  Items: z.array(cartItemServerSchema).nullish(),
});

const BASE_URL = "api/Checkout";

type PostCartCheckoutRequest = z.infer<typeof serverSchema>;

export class CartCheckoutUseCase implements CartCheckoutRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError = (error: unknown, message?: string): false => {
    console.error(message ?? "CartCheckoutUseCase error", error);
    return false;
  };

  query = async (): Promise<CommonCartItem[] | null> => {
    try {
      const result = await this.httpClient.get(`${BASE_URL}/Cart`);

      if (result.data) return convertToCartItem(result.data);

      return null;
    } catch (error) {
      console.error("CartCheckoutUseCase query error", error);
      return null;
    }
  };

  private hasRequiredFields(item: CommonCartItem, petId: string): boolean {
    return Boolean(item.id && item.type && item.quantity && petId);
  }

  post = async (data: CommonCartItem[], petId: string): Promise<boolean> => {
    let body: PostCartCheckoutRequest;

    if (!data.length && !petId) {
      body = { Items: [] };
    } else {
      const validItems = data.filter((item) =>
        this.hasRequiredFields(item, petId)
      );

      if (validItems.length === 0) {
        return this.handleError(
          new Error("Missing required fields for all cart items")
        );
      }

      body = {
        Items: validItems.map((item) => ({
          AnimalId: petId,
          ItemId: item.id,
          ItemType: item.type,
          Quantity: item.quantity,
        })),
      };
    }

    try {
      const response = await this.httpClient.post(BASE_URL, {
        body: JSON.stringify(body),
      });

      if (!response.statusCode) return false;

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (error) {
      return this.handleError(error, "Error updating the cart");
    }
  };
}

function convertToCartItem(data: unknown): CommonCartItem[] | null {
  if (!data) return null;

  const serverResponseSchema = z.object({
    OrderLines: z.array(cartItemServerSchema).nullish(),
  });

  const parsedCart = parseData(serverResponseSchema, data);

  if (!parsedCart || !parsedCart.OrderLines?.length) return null;

  const items: CommonCartItem[] = [];

  parsedCart.OrderLines?.forEach((cartItem) => {
    items.push({
      id: cartItem.ItemId ?? "",
      name: cartItem.ItemName ?? "",
      petId: cartItem.AnimalId ?? "",
      price: cartItem.UnitPrice ?? 0,
      quantity: cartItem.Quantity ?? 0,
      type: cartItem.ItemType ?? "",
    });
  });

  return items;
}
