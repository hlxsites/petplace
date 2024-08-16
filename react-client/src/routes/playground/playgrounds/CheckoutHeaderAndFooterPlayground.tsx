import { Title } from "~/components/design-system";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";

export const CheckoutHeaderAndFooterPlayground = () => {
  return (
    <div className="grid gap-xxxxxlarge">
      <div className="grid gap-xlarge">
        <Title level="h2">Header</Title>
        <CheckoutHeader />
      </div>
      <div className="grid gap-xlarge">
        <Title level="h2">Footer</Title>
        <CheckoutFooter />
      </div>
    </div>
  );
};
