import { Text, Title } from "~/components/design-system";
import { ButtonWithBadge } from "~/components/design-system/button/ButtonWithBadge";
import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";

export const AdditionalProtectionSection = () => {
  const { cartItems, onOpenCart } = useCheckoutProductsViewModelContext();

  const cartItemsLength =
    cartItems?.filter((item) => item.quantity > 0).length || 0;

  return (
    <div className="relative flex w-full justify-between">
      <div>
        <Title level="h3" isResponsive>
          Secure Your Pet's Protection Plan
        </Title>
        <Text isResponsive size="18">
          Add Additional Products, and Confirm Opt-ins and Terms for
          Comprehensive Pet Safety.
        </Text>
      </div>
      <div className="absolute bottom-[160px] right-0 z-20 md:static lg:bottom-0">
        <ButtonWithBadge
          iconProps={{ className: "text-orange-300-contrast" }}
          iconLeft="shoppingCart"
          badge={cartItemsLength}
          onClick={onOpenCart}
        >
          Shopping cart
        </ButtonWithBadge>
      </div>
    </div>
  );
};
