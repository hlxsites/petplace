import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { GetCheckoutAvailableProductsRepository } from "~/domain/repository/checkout/GetCheckoutAvailableProductsRepository";
import { CheckoutModel } from "~/domain/models/checkout/CheckoutModel";
import { checkoutModelSchema } from "./checkoutAvailableProductsSchema";

export class GetCheckoutAvailableProductsUseCase
  implements GetCheckoutAvailableProductsRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError = (error: unknown): null => {
    console.error("GetCheckoutAvailableProductsUseCase query error", error);
    return null;
  };

  query = async (petId: string): Promise<CheckoutModel | null> => {
    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      if (result.data) return convertToCheckoutModelInfo(result.data);

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

function convertToCheckoutModelInfo(data: unknown): CheckoutModel | null {
  if (!data || typeof data !== "object") return null;

  const info = parseData(checkoutModelSchema, data);
  const products = info?.membershipProducts;

  if (!info) return null;

  return {
    membershipProducts: {
      annualMembership: products?.annualMembership,
      lifetimeMembership: products?.lpmMembership,
      lifetimePlusMembership: products?.lpmPlusMembership,
      tags: products?.tags,
    },
  };
}
