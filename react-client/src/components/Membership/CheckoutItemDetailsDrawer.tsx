import { DetailedCartItem } from "~/mocks/MockRestApiServer";
import { Drawer } from "../design-system";
import { CheckoutItemDetailedContent } from "./CheckoutItemDetailedContent";

type CheckoutItemDetailsDrawerProps = {
  addToCart?: () => void;
  item: DetailedCartItem;
  onClose: () => void;
};

export const CheckoutItemDetailsDrawer = ({
  addToCart,
  onClose,
  item,
}: CheckoutItemDetailsDrawerProps) => {
  return (
    <Drawer
      ariaLabel="Product info drawer"
      id={item.id}
      isOpen
      onClose={onClose}
    >
      <CheckoutItemDetailedContent item={item} addToCart={addToCart} />
    </Drawer>
  );
};
