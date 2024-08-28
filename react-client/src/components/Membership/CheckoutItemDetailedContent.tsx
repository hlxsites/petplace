import { DetailedCartItem } from "~/mocks/MockRestApiServer";
import { Button, Text, TextSpan, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

type CheckoutItemDetailedContentProps = {
  item: DetailedCartItem;
  addToCart?: () => void;
};

export const CheckoutItemDetailedContent = ({
  item,
  addToCart,
}: CheckoutItemDetailedContentProps) => {
  const {
    additionalInfo,
    availableColors,
    availableSizes,
    description,
    images,
    isAnnual,
    name,
    price,
    privacyFeatures,
    sizing,
    tagFeatures,
  } = item;

  return (
    <div className="flex flex-col gap-base">
      <div>
        <Title level="h5">{name}</Title>
        <Text fontWeight="bold">
          <TextSpan size="24">{price}</TextSpan>
          {`${isAnnual ? "/year" : ""}`}
        </Text>
      </div>
      <CartItemImages images={images} name={name} />
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
          <Title level="h4">Tag Features</Title>
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
          <Title level="h4">Sizing</Title>
          <Text color="background-color-tertiary" size="14">
            {sizing}
          </Text>
        </>
      )}
      {privacyFeatures && (
        <>
          <Title level="h4">Privacy Features</Title>
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
      <Button fullWidth onClick={addToCart} variant="tertiary">
        Add to cart
      </Button>
    </div>
  );
};
