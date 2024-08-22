import { useState } from "react";
import { Button } from "~/components/design-system";
import { CartDrawer } from "~/components/Membership/CartDrawer";
import { mockCartItems } from "~/mocks/mockCartItems";

export const CartDrawerPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={mockCartItems}
      />
    </div>
  );
};
