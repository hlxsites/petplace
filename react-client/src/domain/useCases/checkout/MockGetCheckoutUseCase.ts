import { GetCheckoutRepository } from "~/domain/repository/checkout/GetCheckoutRepository";
import { CheckoutResolvedData } from "./GetCheckoutUseCase";

export class MockGetCheckoutUseCase implements GetCheckoutRepository {
  query = async (): Promise<CheckoutResolvedData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      actionButtons: [{ label: "Get the best value", isPrimary: true }],
      availablePlans: ["Annual Protection"],
      plans: [
        {
          buttonLabel: "Get 1 Year Protection",
          membershipDescriptionOffers: [
            { offerLabel: "Get help finding your lost pet." },
            {
              offerLabel: "Direct connection to your pet's finder.",
              isNotAvailableOnPlan: true,
            },
          ],
          price: "$1.95",
          priceInfo: "For the first year, $19.95/year thereafter",
          subTitle: "Keep Your Pet Safe All Year",
          title: "Annual Protection",
        },
      ],
    };
  };
}
