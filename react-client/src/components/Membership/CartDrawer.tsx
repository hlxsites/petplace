import { mockCartItems } from "~/mocks/mockCartItems";
import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";
import { useCartCheckout } from "./hooks/useCartCheckout";
import { CartDrawerProps } from "./utils/cartTypes";

export const CartDrawer = ({ items = [], ...props }: CartDrawerProps) => {
  const { cartItems, subtotal, onUpdateQuantity } = useCartCheckout(
    mockCartItems ?? items
  );

  return (
    <Drawer id="cart-drawer" ariaLabel="Cart Drawer" {...props}>
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

        <CartFooter subtotal={subtotal} />
      </div>
    </Drawer>
  );
};
