import { ProductDescription } from "~/domain/models/products/ProductModel";
import { getProductPrice } from "~/domain/util/checkoutProductUtil";
import { classNames } from "~/util/styleUtil";
import { Button, Card, Text, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

type CheckoutProductCardProps = {
  isAnnual?: boolean;
  onChange: ({ color, size }: { color: string; size: string }) => void;
  onClickAddToCart: () => void;
  onClickMoreInfo: () => void;
  product: ProductDescription;
  selectedColorSize: string;
};

export const CheckoutProductCard = ({
  isAnnual,
  onChange,
  onClickAddToCart,
  onClickMoreInfo,
  product,
  selectedColorSize,
}: CheckoutProductCardProps) => {
  const price = getProductPrice(product, selectedColorSize);

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
            onChange={onChange}
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
