import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";
import { useCartCheckout } from "./hooks/useCartCheckout";

import { CommonCartItem } from "~/domain/models/cart/CartModel";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items?: CommonCartItem[];
};

export const CartDrawer = ({ items, ...props }: CartDrawerProps) => {
  console.log("items", items);

  const { subtotal, onUpdateQuantity } = useCartCheckout(items);

  return (
    <Drawer
      id="cart-drawer"
      ariaLabel="Cart Drawer"
      {...props}
      trigger={undefined}
      width={400}
    >
      <div className="flex flex-col gap-large">
        <CartHeader />
        <div className="flex flex-col gap-small">
          <Text size="16" fontWeight="bold">
            Items
          </Text>

          {items?.map((item) => (
            <CartItemCard
              key={item.id}
              onUpdateQuantity={onUpdateQuantity}
              {...item}
            />
          ))}
        </div>

        <CartFooter
          shouldProceedToCheckout={!!items?.length}
          subtotal={subtotal}
        />
      </div>
    </Drawer>
  );
};
