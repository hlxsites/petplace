import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";
import { Drawer, Text } from "../design-system";
import { CartFooter } from "./CartFooter";
import { CartHeader } from "./CartHeader";
import { CartItemCard } from "./CartItemCard";
import { useEffect, useState } from "react";

export const CartDrawer = () => {
  const {
    cartItems,
    isOpenCart,
    onContinueToCheckoutPayment,
    onCloseCart,
    onUpdateQuantity,
    subtotal,
  } = useCheckoutProductsViewModelContext();

  const [filteredCartItems, setFilteredCartItems] = useState(cartItems);

  useEffect(() => {
    setFilteredCartItems(cartItems.filter((item) => item.quantity > 0));
  }, [cartItems]);

  return (
    <Drawer
      id="cart-drawer"
      ariaLabel="Cart Drawer"
      isOpen={isOpenCart}
      onClose={onCloseCart}
      trigger={undefined}
      width={400}
    >
      <div className="flex flex-col gap-large">
        <CartHeader />
        <div className="flex flex-col gap-small">
          <Text size="16" fontWeight="bold">
            Items
          </Text>

          {filteredCartItems?.map((item) => {
            if (item.quantity === 0) return null;
            return (
              <CartItemCard
                key={item.id}
                onUpdateQuantity={onUpdateQuantity}
                {...item}
              />
            );
          })}
        </div>

        <CartFooter onClick={onContinueToCheckoutPayment} subtotal={subtotal} />
      </div>
    </Drawer>
  );
};
