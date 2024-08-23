import { useEffect, useState } from "react";
import { CartItem } from "~/components/Membership/utils/cartTypes";
import { formatPrice, getValueFromPrice } from "~/util/stringUtil";

export function useCartCheckout(initialItems: CartItem[] = []) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [subtotal, setSubtotal] = useState("");

  useEffect(() => {
    function calculateSubtotal(): number {
      return cartItems.reduce((total, item) => {
        const itemPrice = getValueFromPrice(item.price);
        const itemQuantity = item.quantity ?? 1;
        return total + itemPrice * itemQuantity;
      }, 0);
    }

    setSubtotal(formatPrice(calculateSubtotal()));
  }, [cartItems]);

  const onUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  return { subtotal, onUpdateQuantity, cartItems };
}
