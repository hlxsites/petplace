import { Image } from "~/mocks/MockRestApiServer";
import { ImageCarousel } from "../design-system";

type CartItemImagesProps = {
  images: Image[];
  name?: string;
};

export const CartItemImages = ({ images, name }: CartItemImagesProps) => {
  if (images.length === 1) {
    return (
      <img
        alt={`product: ${name}`}
        className="h-[265px] w-full object-contain"
        {...images[0]}
      />
    );
  }

  return (
    <ImageCarousel items={images} ariaLabel={`Images of product: ${name}`} />
  );
};
