import { CheckoutInfoContent } from "../CheckoutInfoContent";

type CheckoutInfoSectionProps = {
  isLandingPage?: boolean;
};

export const CheckoutInfoSection = ({
  isLandingPage,
}: CheckoutInfoSectionProps) => {
  return (
    <div className="mt-xxlarge" role="region">
      <CheckoutInfoContent isLandingPage={isLandingPage} />
    </div>
  );
};
