import { Layout } from "~/components/design-system/layout/Layout";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { MembershipHeader } from "~/components/Membership/sections/MembershipHeader";

export const CheckoutIndex = () => {
  return (
    <>
      <CheckoutHeader />
      <Layout>
        <div className="grid place-items-center gap-xxxxxlarge">
          <MembershipHeader petName="test" />
        </div>
        <CheckoutFooter />
      </Layout>
    </>
  );
};
