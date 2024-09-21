import { z } from "zod";
import {
  CheckoutQueryReturnData,
  MembershipDescriptionOffer,
  MembershipInfo,
  MembershipPlan,
  TableActions,
} from "~/domain/checkout/CheckoutModels";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export const ANNUAL_PROTECTION_PLAN_TITLE = "Annual Protection";
export const LIFETIME_PLAN_TITLE = "Lifetime";
export const LIFETIME_PLUS_PLAN_TITLE = "Lifetime Plus";

const MEMBERSHIP_LIST_OFFERS: MembershipDescriptionOffer[] = [
  { offerLabel: "Get help finding your lost pet." },
  { offerLabel: "Direct connection to your pet's finder." },
  { offerLabel: "Discounts on pet sitting and supplies." },
  { offerLabel: "Critical info shared with shelter/vet. *" },
  { offerLabel: "Talk to a licensed vet anytime 24/7.*" },
  { offerLabel: "Lifetime warranty ID tag." },
  { offerLabel: "Pet Training Courses *." },
];

const addIconToOffers = (startIndex: number): MembershipDescriptionOffer[] =>
  MEMBERSHIP_LIST_OFFERS.map((item, index) =>
    index >= startIndex
      ? { ...item, icon: "clearCircle", isNotAvailableOnPlan: true }
      : item
  );

const ANNUAL_LIST_OFFERS = addIconToOffers(2);
const LIFETIME_LIST_OFFERS = addIconToOffers(5);

const MEMBERSHIP_INFO_OPTIONS: Record<MembershipPlan, MembershipInfo> = {
  [ANNUAL_PROTECTION_PLAN_TITLE]: {
    buttonLabel: "Get 1 Year Protection",
    membershipDescriptionOffers: ANNUAL_LIST_OFFERS,
    price: "$45.95",
    priceInfo: "For the first year, $19.95/year thereafter",
    subTitle: "Keep Your Pet Safe All Year",
    title: ANNUAL_PROTECTION_PLAN_TITLE,
  },
  [LIFETIME_PLAN_TITLE]: {
    buttonLabel: "Get the Best Value",
    isHighlighted: true,
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: LIFETIME_LIST_OFFERS,
    price: "$99.95",
    priceInfo: "One-time fee",
    subTitle: "The Best Value Lost Pet Protection",
    title: LIFETIME_PLAN_TITLE,
  },
  [LIFETIME_PLUS_PLAN_TITLE]: {
    buttonLabel: "Unlock Complete Care",
    infoFooter: "* Complimentary for 1 year",
    membershipDescriptionOffers: MEMBERSHIP_LIST_OFFERS,
    price: "$199.95",
    priceInfo: "One-time fee",
    subTitle: "Complete Lost Pet Protection",
    title: LIFETIME_PLUS_PLAN_TITLE,
  },
};

const MEMBERSHIP_COMPARING_PLANS_BUTTONS: TableActions[] = [
  {
    label: "Get Annual",
  },
  {
    label: "Get Lifetime",
    isPrimary: true,
  },
  {
    label: "Get Lifetime +",
  },
];

const membershipProductSchema = z.object({
  AutoRenew: z.boolean().nullish(),
  ItemId: z.string().nullish(),
  ItemName: z.string().nullish(),
  ItemPrice: z.string().nullish(),
  RenewalPrice: z.string().nullish(),
  SalesPrice: z.string().nullish(),
  IsMostPopular: z.boolean().nullish(),
});

const checkoutSchema = z.object({
  Country: z.union([z.literal("US"), z.literal("CA")]),
  MembershipProducts: z.record(z.string(), membershipProductSchema.nullable()),
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
      actionButtons: [],
      plans: [],
    };

    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      const data = result.data;
      const parsedData = parseData(checkoutSchema, data);

      if (!parsedData) return emptyResult;

      const isCanadaLocale = parsedData.Country === "CA";
      const plans: MembershipInfo[] = [];

      Object.keys(parsedData.MembershipProducts).forEach((key) => {
        if (key.toLowerCase().includes("membership")) {
          const planData = parsedData.MembershipProducts[key];
          if (!planData) return;

          const title = convertMembershipKeyToMembershipPlanTitle(key);

          // Shouldn't be doing this here, this should be handled by the server
          // However, we're trying to protect the FE code from the server's data
          if (isCanadaLocale && title === ANNUAL_PROTECTION_PLAN_TITLE) {
            // Skip the annual plan for Canada
            return;
          }

          const price = planData.SalesPrice || planData.ItemPrice || "-";
          plans.push({
            ...MEMBERSHIP_INFO_OPTIONS[title],
            isHighlighted: !!planData.IsMostPopular,
            price: `$${price}`,
            title: title,
          });
        }
      });

      const actionButtons = isCanadaLocale
        ? MEMBERSHIP_COMPARING_PLANS_BUTTONS.slice(1)
        : MEMBERSHIP_COMPARING_PLANS_BUTTONS;

      return { actionButtons, plans };
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
