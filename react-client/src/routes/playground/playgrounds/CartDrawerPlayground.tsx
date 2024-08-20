import { useState } from "react";
import { Button } from "~/components/design-system";
import { CartDrawer, } from "~/components/Membership/CartDrawer";
import { CartItem } from "~/components/Membership/utils/cartTypes";

const items: CartItem[] = [
  {
    id: "pet-plan",
    name: "Lifetime",
    type: "service",
    description: "24/7 Vet Help & Lost Pet Protection and more...",
    recurrence: "One-time fee",
    acquisitionMessage: "Change membership plan",
    price: "$99.95",
    quantity: 1,
  },
  {
    id: "byte-tag",
    name: "ByteTag",
    type: "product",
    description: "Slide - Medium",
    purchaseLimit: 5,
    price: "$19.95",
    quantity: 2,
  },
];

export const CartDrawerPlayground = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={cartItems}
        updateQuantity={handleUpdateQuantity}
      />
    </div>
  );

  function handleUpdateQuantity(id: string, newQuantity: number) {
    const updatedCartItems = updateQuantity(cartItems, id, newQuantity);
    setCartItems(updatedCartItems);
  }

  function updateQuantity(cartItems: CartItem[], id: string, newQuantity: number): CartItem[] {
    return cartItems.map((item) => {
      if (item.id === id) {
        const quantity = newQuantity > 0 ? newQuantity : 1;
        return { ...item, quantity };
      }
      return item;
    });
  }
};
