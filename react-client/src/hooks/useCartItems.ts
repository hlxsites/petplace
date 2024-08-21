import { useEffect, useState } from "react";
import { CartItem } from "~/components/Membership/utils/cartTypes";
import { formatPrice, getValueFromPrice } from "~/util/stringUtil";

export function useCartItems(items: CartItem[]) {
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

  return { subtotal }
}
