import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";

export type MembershipInfoCard = {
  buttonLabel: string;
  isHighlighted?: boolean;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: MembershipPlan;
};

export type MembershipDescriptionOffer = {
  isNotAvailableOnPlan?: boolean;
  offerLabel: string;
};

export type MembershipPlan = "Annual Protection" | "Lifetime" | "Lifetime Plus";

type Locale = "US" | "CA";

export type TableActions = {
  label: string;
  isPrimary?: boolean;
};

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

export type CheckoutResolvedData = {
  actionButtons: TableActions[];
  availablePlans: MembershipPlan[];
  plans: MembershipInfoCard[];
};

export class GetCheckoutUseCase implements GetCheckoutRepository {
  private httpClient: HttpClientRepository;

  private MEMBERSHIP_PLANS: MembershipPlan[] = [
    "Annual Protection",
    "Lifetime",
    "Lifetime Plus",
  ];

  private US_MEMBERSHIP_PLANS: MembershipPlan[] = [...this.MEMBERSHIP_PLANS];

  private CA_MEMBERSHIP_PLANS: MembershipPlan[] = ["Lifetime", "Lifetime Plus"];

  private MEMBERSHIP_LIST_OFFERS: MembershipDescriptionOffer[] = [
    { offerLabel: "Get help finding your lost pet." },
    { offerLabel: "Direct connection to your pet's finder." },
    { offerLabel: "Discounts on pet sitting and supplies." },
    { offerLabel: "Critical info shared with shelter/vet. *" },
    { offerLabel: "Talk to a licensed vet anytime 24/7.*" },
    { offerLabel: "Lifetime warranty ID tag." },
    { offerLabel: "Pet Training Courses *." },
  ];

  private addIconToOffers = (
    startIndex: number
  ): MembershipDescriptionOffer[] =>
    this.MEMBERSHIP_LIST_OFFERS.map((item, index) =>
      index >= startIndex
        ? { ...item, icon: "clearCircle", isNotAvailableOnPlan: true }
        : item
    );

  private ANNUAL_LIST_OFFERS = this.addIconToOffers(2);
  private LIFETIME_LIST_OFFERS = this.addIconToOffers(5);

  private MEMBERSHIP_CARD_OPTIONS: MembershipInfoCard[] = [
    {
      buttonLabel: "Get 1 Year Protection",
      membershipDescriptionOffers: this.ANNUAL_LIST_OFFERS,
      price: "$45.95",
      priceInfo: "For the first year, $19.95/year thereafter",
      subTitle: "Keep Your Pet Safe All Year",
      title: "Annual Protection",
    },
    {
      buttonLabel: "Get the Best Value",
      isHighlighted: true,
      infoFooter: "* Complimentary for 1 year",
      membershipDescriptionOffers: this.LIFETIME_LIST_OFFERS,
      price: "$99.95",
      priceInfo: "One-time fee",
      subTitle: "The Best Value Lost Pet Protection",
      title: "Lifetime",
    },
    {
      buttonLabel: "Unlock Complete Care",
      infoFooter: "* Complimentary for 1 year",
      membershipDescriptionOffers: this.MEMBERSHIP_LIST_OFFERS,
      price: "$199.95",
      priceInfo: "One-time fee",
      subTitle: "Complete Lost Pet Protection",
      title: "Lifetime Plus",
    },
  ];

  private MEMBERSHIP_COMPARING_PLANS_BUTTONS: TableActions[] = [
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

  query = async (petId: string): Promise<CheckoutResolvedData | null> => {
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

  private getPlansFeatures(locale: Locale): CheckoutResolvedData {
    const isCanadaLocale = locale === "CA";
    const availablePlans = isCanadaLocale
      ? this.CA_MEMBERSHIP_PLANS
      : this.US_MEMBERSHIP_PLANS;

    const plans = this.MEMBERSHIP_CARD_OPTIONS.filter(({ title }) =>
      availablePlans.includes(title)
    );

    const actionButtons = isCanadaLocale
      ? this.MEMBERSHIP_COMPARING_PLANS_BUTTONS.slice(1)
      : this.MEMBERSHIP_COMPARING_PLANS_BUTTONS;

    return { actionButtons, availablePlans, plans };
  }
}
