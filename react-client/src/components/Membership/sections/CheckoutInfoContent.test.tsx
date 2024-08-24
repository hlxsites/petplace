import { ComponentProps } from "react";
import { CheckoutInfoContent } from "../CheckoutInfoContent";
import { render, screen } from "@testing-library/react";
import { getByTextContent } from "~/util/testingFunctions";

const COMMON_INFO_MESSAGE =
  "You consent and authorize Pethealth Services Inc. to enroll you into recurring billing for the above noted products/services via credit card on the renewal date, plus applicable taxes. You will be sent a reminder email 30 days prior to your renewal date and the charge will appear on your credit card statement as 24Petwatch. When you agree to renew your products/services, you authorize Pethealth Services Inc. to charge your credit card plus applicable taxes. Once charged, membership fees for our products/services, discount codes and coupons are non-refundable. Prices are subject to change. You have the option to withdraw from recurring billing at any time by logging into your account at petplace.com or calling 1-833-461-8756.";

const LANDING_PAGE_MESSAGE =
  "Pet parents who register their microchips with PetPlace, powered by 24Petwatch, will receive our standard pet protection services, which include access to our self-serve lost pet recovery and the ability to update their contact information in their PetPlace.com account.";

const { queryByText, getByText } = screen;

describe("CheckoutInfoContent", () => {
  it("should render the common info section message when it's not the landing page", () => {
    getRenderer({ isLandingPage: false });

    expect(getByText(COMMON_INFO_MESSAGE)).toBeInTheDocument();
    expect(queryByText(LANDING_PAGE_MESSAGE)).not.toBeInTheDocument();
  });

  it("should render the landing page info section message when it's the landing page", () => {
    getRenderer({ isLandingPage: true });

    expect(getByTextContent(LANDING_PAGE_MESSAGE)).toBeInTheDocument();
    expect(queryByText(COMMON_INFO_MESSAGE)).not.toBeInTheDocument();
  });
});

function getRenderer({
  isLandingPage = false,
}: Partial<ComponentProps<typeof CheckoutInfoContent>> = {}) {
  return render(<CheckoutInfoContent isLandingPage={isLandingPage} />);
}
