import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { CartCheckoutRepository } from "~/domain/repository/cart/CartCheckoutRepository";
import { AnimalInfo, CartItem } from "~/domain/models/cart/CartModel";
import { z } from "zod";

const cartItemServerSchema = z.object({
  AnimalId: z.string().nullish(),
  ItemId: z.string().nullish(),
  ItemType: z.string().nullish(),
  Quantity: z.number().nullish(),
});

const serverSchema = z.object({
  Items: z.array(cartItemServerSchema).nullish(),
});

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

  post = async (data?: CartItem, animalInfo?: AnimalInfo): Promise<boolean> => {
    let body: PostCartCheckoutRequest;

    if (!data && !animalInfo) {
      body = { Items: [] };
    } else {
      const convertedBody = convertToServerCartCheckout(data, animalInfo);
      if (!convertedBody) {
        return this.handleError(
          new Error("Missing required fields for cart checkout")
        );
      }
      body = convertedBody;
    }

    try {
      const response = await this.httpClient.post("api/Checkout", {
        body: JSON.stringify(body),
      });

      if (!response.statusCode) return false;

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (error) {
      return this.handleError(error, "Error updating the cart");
    }
  };
}

function hasRequiredFields(data: CartItem, animalInfo: AnimalInfo): boolean {
  return Boolean(data.id && data.type && data.quantity && animalInfo.id);
}

function convertToServerCartCheckout(
  data?: CartItem,
  animalInfo?: AnimalInfo
): PostCartCheckoutRequest | null {
  if (!data || !animalInfo || !hasRequiredFields(data, animalInfo)) {
    return null;
  }

  return {
    Items: [
      {
        AnimalId: animalInfo.id,
        ItemId: data.id,
        ItemType: data.type,
        Quantity: data.quantity,
      },
    ],
  };
}
