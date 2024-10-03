import { DetailedCartItem } from "~/domain/models/products/ProductModel";
import { Drawer } from "../design-system";
import { CheckoutItemDetailedContent } from "./CheckoutItemDetailedContent";

type CheckoutItemDetailsDrawerProps = {
  onAddToCart?: () => void;
  onChange: ({ color, size }: { color: string; size: string }) => void;
  onClose: () => void;
  product: DetailedCartItem;
  selectedColorSize: string;
};

export const CheckoutItemDetailsDrawer = ({
  onAddToCart,
  onChange,
  onClose,
  product,
  selectedColorSize,
}: CheckoutItemDetailsDrawerProps) => {
  return (
    <Drawer
      ariaLabel="Product info drawer"
      id={product.id}
      isOpen
      onClose={onClose}
      title={product.title}
      trigger={undefined}
      width={440}
    >
      <CheckoutItemDetailedContent
        onAddToCart={onAddToCart}
        onChange={onChange}
        product={product}
        selectedColorSize={selectedColorSize}
      />
    </Drawer>
  );
};
