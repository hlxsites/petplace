import { Button } from "~/components/design-system";
import { CartDrawer } from "~/components/Membership/CartDrawer";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { AdditionalProtectionSection } from "~/components/Membership/sections/AdditionalProtectionSection";
import { CheckoutInfoSection } from "~/components/Membership/sections/CheckoutInfoSection";
import { CheckoutProductsSection } from "~/components/Membership/sections/CheckoutProductsSection";
import { OptInsSection } from "~/components/Membership/sections/OptInsSection";
import { useCheckoutProductsViewModelContext } from "./useCheckoutProductsViewModel";

export const ProductsIndex = () => {
  const { onContinueToCheckoutPayment } = useCheckoutProductsViewModelContext();
  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <CheckoutHeader />
      <main className="m-auto w-full px-base py-[80px] xl:w-[1080px] xl:px-0">
        <div className="grid place-items-center gap-xxlarge">
          <AdditionalProtectionSection />
          <div className="grid gap-large">
            <OptInsSection />
            <CheckoutProductsSection />
            <Button fullWidth onClick={onContinueToCheckoutPayment}>
              Proceed to checkout
            </Button>
          </div>
          <CheckoutInfoSection />
        </div>
      </main>
      <CheckoutFooter />
      <CartDrawer />
    </div>
  );
};
