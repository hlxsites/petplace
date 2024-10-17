import { useLocation } from "react-router-dom";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { CheckoutInfoSection } from "~/components/Membership/sections/CheckoutInfoSection";
import { MembershipComparingPlansSection } from "~/components/Membership/sections/MembershipComparingPlansSection";
import { MembershipHeader } from "~/components/Membership/sections/MembershipHeader";
import { MembershipOfferSection } from "~/components/Membership/sections/MembershipOfferSection";
import { useCheckoutIndexViewModel } from "./useCheckoutIndexViewModel";

export const CheckoutIndex = () => {
  const { petName } = useCheckoutIndexViewModel();
  const { pathname } = useLocation();

  const isLandingPage = pathname === "/checkout";

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <CheckoutHeader />
      <main className="m-auto w-full px-base py-[80px] xl:w-[1080px] xl:px-0">
        <div className="grid place-items-center gap-xxxxxlarge">
          <MembershipHeader petName={petName ?? "your pet"} />
          <MembershipOfferSection />
          <MembershipComparingPlansSection />
          <CheckoutInfoSection isLandingPage={isLandingPage} />
        </div>
      </main>
      <CheckoutFooter />
    </div>
  );
};
