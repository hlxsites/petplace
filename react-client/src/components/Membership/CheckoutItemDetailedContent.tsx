import { DetailedCartItem } from "~/mocks/MockRestApiServer";
import { Button, Text, TextSpan, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

type CheckoutItemDetailedContentProps = {
  item: DetailedCartItem;
  onAddToCart?: () => void;
};

export const CheckoutItemDetailedContent = ({
  item,
  onAddToCart,
}: CheckoutItemDetailedContentProps) => {
  const {
    additionalInfo,
    availableColors,
    availableSizes,
    description,
    images,
    isAnnual,
    title,
    price,
    privacyFeatures,
    sizing,
    tagFeatures,
  } = item;

  return (
    <div className="flex flex-col gap-base">
      <Text fontWeight="bold">
        <TextSpan size="24">{price}</TextSpan>
        {`${isAnnual ? "/year" : ""}`}
      </Text>

      <CartItemImages images={images} name={title} />
      <div className="flex flex-col gap-base">
        <Text color="background-color-tertiary" size="14">
          {description}
        </Text>
        {additionalInfo && (
          <Text color="background-color-tertiary">{additionalInfo}</Text>
        )}
      </div>
      {tagFeatures && (
        <>
          <Title level="h5">Tag Features</Title>
          <ul className="pl-0">
            {tagFeatures.map((feature) => (
              <li className="mb-xsmall flex items-center" key={feature}>
                <span className="mr-small h-[2px] w-[2px] rounded-full bg-black"></span>
                <Text color="background-color-tertiary">{feature}</Text>
              </li>
            ))}
          </ul>
        </>
      )}
      {sizing && (
        <>
          <Title level="h5">Sizing</Title>
          <Text color="background-color-tertiary" size="14">
            {sizing}
          </Text>
        </>
      )}
      {privacyFeatures && (
        <>
          <Title level="h5">Privacy Features</Title>
          <Text color="background-color-tertiary" size="14">
            {privacyFeatures}
          </Text>
        </>
      )}
      {availableColors && availableSizes && (
        <CheckoutProductColorSize
          productColors={availableColors}
          productSizes={availableSizes}
        />
      )}
      <Button fullWidth onClick={onAddToCart} variant="tertiary">
        Add to cart
      </Button>
    </div>
  );
};
