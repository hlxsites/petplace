import { z } from "zod";
import {
  CheckoutQueryReturnData,
  MembershipInfo,
  MembershipPlanId,
} from "~/domain/checkout/CheckoutModels";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { MEMBERSHIP_INFO_OPTIONS } from "./utils/checkoutHardCodedData";

const membershipProductSchema = z.object({
  AutoRenew: z.boolean().nullish(),
  IsMostPopular: z.boolean().nullish(),
  ItemId: z.string().nullish(),
  ItemName: z.string().nullish(),
  ItemPrice: z.string().nullish(),
  ItemType: z.string().nullish(),
  RenewalPrice: z.string().nullish(),
  SalesPrice: z.string().nullish(),
  UiName: z.string().nullish(),
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

          const membershipPlan = convertMembershipKeyToMembershipPlanId(key);
          if (!membershipPlan) {
            logError("Failed to convert key to hardcoded membership plan id", {
              key,
            });
            return;
          }

          const hardCodedPlan = MEMBERSHIP_INFO_OPTIONS[membershipPlan];
          if (!hardCodedPlan) {
            logError("Failed to find hard-coded plan", { membershipPlan });
            return;
          }

          // Shouldn't be doing this here, this should be handled by the server
          // However, we're trying to protect the FE code from the server's data
          if (
            isCanadaLocale &&
            membershipPlan.toLowerCase().includes("annual")
          ) {
            // Skip the annual plan for Canada
            return;
          }

          const id = planData.ItemId;
          const price = planData.SalesPrice || planData.ItemPrice;

          // Skip the plan if the id or the price is not available
          if (!id || !price) {
            logError("Membership doesn't include required props", {
              id,
              price,
            });
            return;
          }

          const isHighlighted = (() => {
            if (typeof planData.IsMostPopular === "boolean") {
              return planData.IsMostPopular;
            }
            // Fallback to the hard-coded value if the server doesn't provide it
            return hardCodedPlan.isHighlighted;
          })();

          plans.push({
            ...hardCodedPlan,
            id,
            isHighlighted,
            price,
            title: planData.UiName || hardCodedPlan.title,
            type: planData.ItemType ?? hardCodedPlan.type,
          });
        }
      });

      return { plans };
    } catch (error) {
      logError("GetCheckoutUseCase query error", error);
      return emptyResult;
    }
  };
}

function convertMembershipKeyToMembershipPlanId(
  key: string
): MembershipPlanId | null {
  const lowercasedKey = key.toLowerCase();

  // This code is fragile, but it's the best we can do with the current server data
  if (lowercasedKey.includes("annual")) {
    return "AnnualMembership";
  }
  if (lowercasedKey.includes("lpmplus")) {
    return "LPMPlusMembership";
  }
  if (lowercasedKey.includes("lpm")) {
    return "LPMMembership";
  }
  return null;
}
