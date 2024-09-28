import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";

import { CommonCartItem } from "~/domain/models/cart/CartModel";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items?: CommonCartItem[];
  subtotal: string;
};

export const CartDrawer = ({ items, subtotal, ...props }: CartDrawerProps) => {
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
              // onUpdateQuantity={onUpdateQuantity}
              {...item}
            />
          ))}
        </div>

        <CartFooter subtotal={subtotal} />
      </div>
    </Drawer>
  );
};
