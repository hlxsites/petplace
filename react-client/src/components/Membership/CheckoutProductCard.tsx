import { useState } from "react";
import { ProductDescription } from "~/domain/models/products/ProductModel";
import { classNames } from "~/util/styleUtil";
import { Button, Card, Text, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

type CheckoutProductCardProps = {
  isAnnual?: boolean;
  onClickAddToCart: () => void;
  onClickMoreInfo: () => void;
  product: ProductDescription;
};

export const CheckoutProductCard = ({
  isAnnual,
  onClickAddToCart,
  onClickMoreInfo,
  product,
}: CheckoutProductCardProps) => {
  const initialColorSizeState = (() => {
    const availableColors = product.availableColors ?? [];
    const availableSizes = product.availableSizes ?? [];

    return `${availableColors[0] ?? ""}|${availableSizes[0] ?? ""}`;
  })();

  const [selectedColorSize, setSelectedColorSize] = useState<string>(
    initialColorSizeState
  );
  const handleOnChange = ({ color, size }: { color: string; size: string }) => {
    setSelectedColorSize(`${color}|${size}`);
  };

  const price = (() => {
    const productOption = product.availableOptions[selectedColorSize];
    if (productOption) return productOption.price;

    // try the default option
    return product.availableOptions?.["default"]?.price || null;
  })();

  const [selectedColor, selectedSize] = selectedColorSize.split("|");
  const imageElement = renderProductImage();

  const descriptionElement = (() => {
    if (!product.description) return null;
    return (
      <Text color="background-color-tertiary" size="12">
        {product.description}
      </Text>
    );
  })();

  return (
    <Card border="border-border-base-color">
      <div className="flex flex-col gap-large p-large">
        <div className="flex justify-between">
          <Title level="h4">{product.title}</Title>
          <div
            className={classNames("flex flex-col text-right", {
              invisible: !price,
            })}
          >
            <Text fontWeight="bold" size="24">
              ${price}
            </Text>
            {isAnnual && <Text fontWeight="bold">/year</Text>}
          </div>
        </div>
        {imageElement && (
          <Card border="border-border-base-color">{imageElement}</Card>
        )}
        <div className="h-[58px]">
          {descriptionElement}
          <CheckoutProductColorSize
            availableColors={product.availableColors ?? []}
            availableSizes={product.availableSizes ?? []}
            onChange={handleOnChange}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </div>
        <div className="grid w-full gap-xsmall">
          <Button
            disabled={!price}
            fullWidth
            onClick={onClickAddToCart}
            variant="tertiary"
          >
            {price ? "Add to cart" : "Unavailable"}
          </Button>
          <Button
            className="text-orange-300-contrast"
            fullWidth
            onClick={onClickMoreInfo}
            variant="link"
          >
            More info
          </Button>
        </div>
      </div>
    </Card>
  );

  function renderProductImage() {
    const { images, title } = product;
    if (!images.length) return null;

    return <CartItemImages images={images} name={title || "image"} />;
  }
};
