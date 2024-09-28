import { useEffect, useState } from "react";
import { CommonCartItem } from "~/domain/models/cart/CartModel";

import { formatPrice, getValueFromPrice } from "~/util/stringUtil";

export function useCartCheckout(initialItems: CommonCartItem[] = []) {
  const [cartItems, setCartItems] = useState<CommonCartItem[]>(initialItems);
  const [subtotal, setSubtotal] = useState("");

  useEffect(() => {
    function calculateSubtotal(): number {
      return cartItems.reduce((total, item) => {
        if (!item.price) return 0;

        const itemPrice = getValueFromPrice(item.price.toString());
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
