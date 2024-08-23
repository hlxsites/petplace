import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { MembershipHeader } from "~/components/Membership/sections/MembershipHeader";
import { MembershipOfferSection } from "~/components/Membership/sections/MembershipOfferSection";

export const CheckoutIndex = () => {
  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <CheckoutHeader />
      <main className="m-auto w-full px-base py-[80px] xl:w-[1080px] xl:px-0">
        <div className="grid place-items-center gap-xxxxxlarge">
          <MembershipHeader petName="test" />
          <MembershipOfferSection />
        </div>

        <CheckoutFooter />
      </main>
    </div>
  );
};
