import { CheckoutInfoContent } from "../CheckoutInfoContent";

type CheckoutInfoSectionProps = {
  isLandingPage?: boolean;
};

export const CheckoutInfoSection = ({
  isLandingPage,
}: CheckoutInfoSectionProps) => {
  return (
    <div role="region">
      <CheckoutInfoContent isLandingPage={isLandingPage} />
    </div>
  );
};
