import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";
import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";

export const CartDrawer = () => {
  const {
    cartItems,
    isOpenCart,
    onContinueToCheckoutPayment,
    onCloseCart,
    onUpdateQuantity,
    subtotal,
  } = useCheckoutProductsViewModelContext();

  return (
    <Drawer
      id="cart-drawer"
      ariaLabel="Cart Drawer"
      isOpen={isOpenCart}
      onClose={onCloseCart}
      trigger={undefined}
    >
      <div className="flex flex-col gap-large">
        <CartHeader />
        <div className="flex flex-col gap-small">
          <Text size="16" fontWeight="bold">
            Items
          </Text>

          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              onUpdateQuantity={onUpdateQuantity}
              {...item}
            />
          ))}
        </div>

        <CartFooter onClick={onContinueToCheckoutPayment} subtotal={subtotal} />
      </div>
    </Drawer>
  );
};
