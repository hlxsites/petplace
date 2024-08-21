import { Text } from "~/components/design-system";

type CheckoutInfoSectionProps = {
  isLandingPage: boolean;
};

export const CheckoutInfoSection = ({
  isLandingPage,
}: CheckoutInfoSectionProps) => {
  return (
    <div className="mt-xxlarge" role="region">
      <Text>{renderInfoContent()}</Text>
    </div>
  );

  function renderInfoContent() {
    return isLandingPage ? (
      <>
        Pet parents who register their microchips with PetPlace, powered by
        24Petwatch, will receive our standard pet protection services, which
        include access to our self-serve lost pet recovery and the ability to
        update their contact information in their{" "}
        <a href="https://petplace.com">PetPlace.com</a> account.
      </>
    ) : (
      "You consent and authorize Pethealth Services Inc. to enroll you into recurring billing for the above noted products/services via credit card on the renewal date, plus applicable taxes. You will be sent a reminder email 30 days prior to your renewal date and the charge will appear on your credit card statement as 24Petwatch. When you agree to renew your products/services, you authorize Pethealth Services Inc. to charge your credit card plus applicable taxes. Once charged, membership fees for our products/services, discount codes and coupons are non-refundable. Prices are subject to change. You have the option to withdraw from recurring billing at any time by logging into your account at petplace.com or calling 1-833-461-8756."
    );
  }
};
