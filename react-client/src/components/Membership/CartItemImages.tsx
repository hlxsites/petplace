import { Card, ImageCarousel } from "../design-system";

type CartItemImagesProps = {
  images: string[];
  name?: string;
};

export const CartItemImages = ({ images, name }: CartItemImagesProps) => {
  if (!images.length) return null;

  const altText = name ? `product: ${name}` : "Product image";
  const isSingleImage = images.length === 1;

  return (
    <Card>
      {isSingleImage ? (
        <img
          src={images[0]}
          alt={altText}
          className="h-[265px] w-full object-contain"
        />
      ) : (
        <ImageCarousel
          items={images.map((src, index) => ({
            alt: `${altText} #${index}`,
            src,
          }))}
          ariaLabel={`Images of product: ${name || "Product"}`}
        />
      )}
    </Card>
  );
};
