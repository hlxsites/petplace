import { CheckoutInfoSection } from "~/components/Membership/sections/CheckoutInfoSection";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { MembershipHeader } from "~/components/Membership/sections/MembershipHeader";
import { MembershipOfferSection } from "~/components/Membership/sections/MembershipOfferSection";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { useLocation } from "react-router-dom";

export const CheckoutIndex = () => {
  const { pathname } = useLocation();
  const isLandingPage = pathname === "/checkout";

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <CheckoutHeader />
      <main className="m-auto w-full px-base py-[80px] xl:w-[1080px] xl:px-0">
        <div className="grid place-items-center gap-xxxxxlarge">
          <MembershipHeader petName="test" />
          <MembershipOfferSection />
          <CheckoutInfoSection isLandingPage={isLandingPage} />
        </div>
      </main>
      <CheckoutFooter />
    </div>
  );
};
