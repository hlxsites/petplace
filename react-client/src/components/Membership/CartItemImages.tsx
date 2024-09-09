import { Image } from "~/mocks/MockRestApiServer";
import { ImageCarousel } from "../design-system";

type CartItemImagesProps = {
  images: Image[];
  name?: string;
};

export const CartItemImages = ({ images, name }: CartItemImagesProps) => {
  const validImages = Array.isArray(images) && images.length > 0 ? images : [];
  const validImagesLength = validImages.length;

  if (!validImagesLength) return null;

  if (validImagesLength === 1) {
    return (
      <img
        {...images[0]}
        alt={name ? `product: ${name}` : "Product image"}
        className="h-[265px] w-full object-contain"
      />
    );
  }

  return (
    <ImageCarousel
      items={validImages}
      ariaLabel={`Images of product: ${name || "Product"}`}
    />
  );
};
