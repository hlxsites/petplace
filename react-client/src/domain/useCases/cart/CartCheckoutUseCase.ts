import { z } from "zod";
import { CommonCartItem, QueryCartItem } from "~/domain/models/cart/CartModel";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { logError } from "~/infrastructure/telemetry/logUtils";

const cartItemServerSchema = z.object({
  AnimalId: z.string().nullish(),
  AutoRenew: z.number().nullish(),
  ItemId: z.string().nullish(),
  ItemType: z.string().nullish(),
  Quantity: z.number().nullish(),
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
    logError(message ?? "CartCheckoutUseCase error", error);
    return false;
  };

  query = async (): Promise<QueryCartItem[]> => {
    try {
      const result = await this.httpClient.get(`${BASE_URL}/Cart`);
      if (result.data) {
        return convertToCartItem(result.data);
      }
    } catch (error) {
      logError("CartCheckoutUseCase query error", error);
    }
    return [];
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
          AutoRenew: convertAutoRenewFromBooleanToNumber(item.autoRenew),
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

function convertToCartItem(data: unknown): QueryCartItem[] {
  if (!data) return [];

  const itemSchema = z.object({
    AnimalId: z.string().nullish(),
    AutoRenew: z.number().nullish(),
    ItemId: z.string().nullish(),
    Quantity: z.number().nullish(),
  });

  const serverResponseSchema = z.object({
    OrderLines: z.array(itemSchema).nullish(),
  });

  const parsedCart = parseData(serverResponseSchema, data);

  if (!parsedCart || !parsedCart.OrderLines?.length) return [];

  const items: QueryCartItem[] = [];

  parsedCart.OrderLines?.forEach((cartItem) => {
    const petId = cartItem.AnimalId ?? "";
    const quantity = cartItem.Quantity ?? 0;
    const id = cartItem.ItemId ?? "";

    if (!petId || !quantity || !id) {
      logError("Missing required fields for cart item", {
        id,
        petId,
        quantity,
      });
      return;
    }

    items.push({
      autoRenew: convertAutoRenewFromNumberToBoolean(cartItem.AutoRenew),
      id,
      petId,
      quantity,
    });
  });

  return items;
}

function convertAutoRenewFromNumberToBoolean(data?: number | null) {
  const AutoRenew: Record<number, boolean> = {
    0: false,
    1: true,
  };

  return AutoRenew[data ?? 0];
}

function convertAutoRenewFromBooleanToNumber(data: boolean | undefined) {
  if (data) return 1;
  return 0;
}
