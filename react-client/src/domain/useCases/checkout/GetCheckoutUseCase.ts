import { z } from "zod";
import {
  CheckoutQueryReturnData,
  MembershipInfo,
  MembershipPlan,
} from "~/domain/checkout/CheckoutModels";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { MEMBERSHIP_INFO_OPTIONS } from "./utils/checkoutHardCodedData";

export const ANNUAL_PROTECTION_PLAN_TITLE = "Annual Protection";
export const LIFETIME_PLAN_TITLE = "Lifetime";
export const LIFETIME_PLUS_PLAN_TITLE = "Lifetime Plus";

const membershipProductSchema = z.object({
  AutoRenew: z.boolean().nullish(),
  IsMostPopular: z.boolean().nullish(),
  ItemId: z.string().nullish(),
  ItemName: z.string().nullish(),
  ItemPrice: z.string().nullish(),
  RenewalPrice: z.string().nullish(),
  SalesPrice: z.string().nullish(),
});

const checkoutSchema = z.object({
  Country: z.union([z.literal("US"), z.literal("CA")]).nullish(),
  MembershipProducts: z.record(z.string(), membershipProductSchema.nullish()),
});

export class GetCheckoutUseCase implements GetCheckoutRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (petId: string): Promise<CheckoutQueryReturnData> => {
    const emptyResult: CheckoutQueryReturnData = {
      plans: [],
    };

    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      const data = result.data;
      const parsedData = parseData(checkoutSchema, data);

      if (!parsedData?.MembershipProducts) return emptyResult;

      const isCanadaLocale = parsedData?.Country === "CA";
      const plans: MembershipInfo[] = [];

      Object.keys(parsedData.MembershipProducts).forEach((key) => {
        if (key.toLowerCase().includes("membership")) {
          const planData = parsedData.MembershipProducts[key];
          if (!planData) return;

          const title = convertMembershipKeyToMembershipPlanTitle(key);

          const hardCodedPlan = MEMBERSHIP_INFO_OPTIONS[title];
          if (!hardCodedPlan) return;

          // Shouldn't be doing this here, this should be handled by the server
          // However, we're trying to protect the FE code from the server's data
          if (
            isCanadaLocale &&
            hardCodedPlan.id.toLowerCase().includes("annual")
          ) {
            // Skip the annual plan for Canada
            return;
          }

          const price = planData.SalesPrice || planData.ItemPrice || "-";

          const isHighlighted = (() => {
            if (typeof planData.IsMostPopular === "boolean") {
              return planData.IsMostPopular;
            }
            // Fallback to the hard-coded value if the server doesn't provide it
            return hardCodedPlan.isHighlighted;
          })();

          plans.push({
            ...hardCodedPlan,
            isHighlighted,
            price: `$${price}`,
            title: planData.ItemName || title,
          });
        }
      });

      return { plans };
    } catch (error) {
      console.error("GetCheckoutUseCase query error", error);
      return emptyResult;
    }
  };
}

function convertMembershipKeyToMembershipPlanTitle(
  key: string
): MembershipPlan {
  const lowercasedKey = key.toLowerCase();

  // This code is fragile, but it's the best we can do with the current server data

  if (lowercasedKey.includes("annual")) {
    return ANNUAL_PROTECTION_PLAN_TITLE;
  }
  if (lowercasedKey.includes("lpmplus")) {
    return LIFETIME_PLUS_PLAN_TITLE;
  }
  return LIFETIME_PLAN_TITLE;
}
