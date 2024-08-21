import { useCartItems } from "~/hooks/useCartItems";
import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";
import { CartDrawerProps } from "./utils/cartTypes";

export const CartDrawer = ({
  items,
  updateQuantity,
  ...props
}: CartDrawerProps & {
  updateQuantity: (id: string, value: number) => void;
}) => {
  const { subtotal } = useCartItems(items);

  return (
    <Drawer id="cart-drawer" ariaLabel="Cart Drawer" {...props}>
      <div className="flex flex-col gap-large">
        <CartHeader />
        <div className="flex flex-col gap-small">
          <Text size="base" fontWeight="bold">
            Items
          </Text>

          {items.map((props) => (
            <CartItemCard
              key={props.id}
              updateQuantity={updateQuantity}
              {...props}
            />
          ))}
        </div>

        <CartFooter subtotal={subtotal} />
      </div>
    </Drawer>
  );
};
