import { useEffect, useState } from "react";
import { formatPrice, getValueFromPrice } from "~/util/stringUtil";
import { Button, Drawer, Icon, Text } from "../design-system";
import { CartItemCard } from "./CartItemCard";
import { CartDrawerProps } from "./utils/cartTypes";

export const CartDrawer = ({
  items,
  updateQuantity,
  ...props
}: CartDrawerProps & {
  updateQuantity: (id: string, value: number) => void;
}) => {
  const [subtotal, setSubtotal] = useState("");

  useEffect(() => {
    function calculateSubtotal(): number {
      return items.reduce((total, item) => {
        const itemPrice = getValueFromPrice(item.price);
        const itemQuantity = item.quantity ?? 1;
        return total + itemPrice * itemQuantity;
      }, 0);
    }

    setSubtotal(formatPrice(calculateSubtotal()));
  }, [items]);

  return (
    <Drawer id="cart-drawer" ariaLabel="Cart Drawer" {...props}>
      <div className="flex flex-col gap-large">
        <div className="flex items-center">
          <Icon
            display="shoppingCart"
            className="mr-small text-orange-300-contrast"
          />
          <Text fontWeight="bold" size="xlg">
            My Cart
          </Text>
        </div>

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

        <div className="flex w-full justify-between">
          <div className="w-1/2">
            <Text fontWeight="bold" display="block">
              Subtotal
            </Text>
            <Text color="background-color-tertiary">
              Applicable taxes will be applied at checkout
            </Text>
          </div>
          <Text fontWeight="bold" size="xlg">
            {`$${subtotal}`}
          </Text>
        </div>

        <Button>Proceed to checkout</Button>
      </div>
    </Drawer>
  );
};
