import { Button } from "~/components/design-system";
import { CheckoutFooter } from "~/components/Membership/CheckoutFooter";
import { CheckoutHeader } from "~/components/Membership/CheckoutHeader";
import { AdditionalProtectionSection } from "~/components/Membership/sections/AdditionalProtectionSection";
import { CheckoutInfoSection } from "~/components/Membership/sections/CheckoutInfoSection";
import { OptInsSection } from "~/components/Membership/sections/OptInsSection";
import { useCheckoutIndexViewModel } from "../useCheckoutIndexViewModel";
import { CheckoutProductsSection } from "~/components/Membership/sections/CheckoutProductsSection";

export const ProductsIndex = () => {
  const { products } = useCheckoutIndexViewModel();

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <CheckoutHeader />
      <main className="m-auto w-full px-base py-[80px] xl:w-[1080px] xl:px-0">
        <div className="grid place-items-center gap-xxlarge">
          <AdditionalProtectionSection />
          <div className="grid gap-large">
            <OptInsSection />
            <CheckoutProductsSection products={products} />
            <Button fullWidth>Proceed to checkout</Button>
          </div>
          <CheckoutInfoSection />
        </div>
      </main>
      <CheckoutFooter />
    </div>
  );
};