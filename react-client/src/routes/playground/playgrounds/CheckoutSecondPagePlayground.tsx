import { AdditionalProtectionSection } from "~/components/Membership/sections/AdditionalProtectionSection";
import { OptInsSection } from "~/components/Membership/sections/OptInsSection";

export const CheckoutSecondPagePlayground = () => {
  return (
    <div className="grid gap-large">
      <AdditionalProtectionSection />
      <OptInsSection />
    </div>
  );
};
