import { DetailedCartItem } from "~/domain/models/products/ProductModel";
import { Drawer } from "../design-system";
import { CheckoutItemDetailedContent } from "./CheckoutItemDetailedContent";

type CheckoutItemDetailsDrawerProps = {
  item: DetailedCartItem;
  onAddToCart?: () => void;
  onClose: () => void;
};

export const CheckoutItemDetailsDrawer = ({
  item,
  onAddToCart,
  onClose,
}: CheckoutItemDetailsDrawerProps) => {
  return (
    <Drawer
      ariaLabel="Product info drawer"
      id={item.id}
      isOpen
      onClose={onClose}
      title={item.title}
      trigger={undefined}
    >
      <CheckoutItemDetailedContent item={item} onAddToCart={onAddToCart} />
    </Drawer>
  );
};
