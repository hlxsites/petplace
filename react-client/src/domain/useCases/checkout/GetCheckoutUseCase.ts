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

type Locale = "US" | "CA";
type CheckoutData = {
  Country?: string | null;
  MembershipProducts?: {
    AnnualMembership?: {
      SalesPrice?: string | null;
    } | null;
    LPMMembership?: {
      ItemPrice?: string | null;
    } | null;
    LPMPlusMembership?: {
      ItemPrice?: string | null;
    } | null;
  } | null;
};

const ANNUAL_PROTECTION_PLAN_TITLE = "Annual Protection";
const LIFETIME_PLAN_TITLE = "Lifetime";
const LIFETIME_PLUS_PLAN_TITLE = "Lifetime Plus";

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  ANNUAL_PROTECTION_PLAN_TITLE,
  LIFETIME_PLAN_TITLE,
  LIFETIME_PLUS_PLAN_TITLE,
];

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

export class GetCheckoutUseCase implements GetCheckoutRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError = (error: unknown): null => {
    console.error("GetCheckoutUseCase query error", error);
    return null;
  };

  query = async (petId: string): Promise<CheckoutQueryReturnData | null> => {
    try {
      const result = await this.httpClient.get(
        `api/Pet/${petId}/available-products`
      );

      const data = result.data as CheckoutData;

      if (data) {
        const locale = this.getLocale(data.Country);
        return this.getPlansFeatures(locale);
      }

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };

  private getLocale(locale?: string | null): Locale {
    const availableLocales: Locale[] = ["US", "CA"];
    if (locale && availableLocales.includes(locale as Locale)) {
      return locale as Locale;
    }
    return "US" as Locale;
  }

  private getPlansFeatures(locale: Locale): CheckoutQueryReturnData {
    const isCanadaLocale = locale === "CA";

    const plans: MembershipInfo[] = [];
    MEMBERSHIP_PLANS.forEach((planTitle) => {
      // Annual Protection plan is not available for Canada
      if (isCanadaLocale && planTitle === ANNUAL_PROTECTION_PLAN_TITLE) {
        return false;
      }

      return plans.push(MEMBERSHIP_INFO_OPTIONS[planTitle]);
    });

    const actionButtons = isCanadaLocale
      ? MEMBERSHIP_COMPARING_PLANS_BUTTONS.slice(1)
      : MEMBERSHIP_COMPARING_PLANS_BUTTONS;

    return { actionButtons, plans };
  }
}
