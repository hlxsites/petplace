import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { Card, Text, TextSpan, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";

export const CheckoutServiceCard = ({
  price,
  isAnnual,
  images,
  description,
  title,
}: CheckoutServices) => {
  const priceString = (() => {
    if (isAnnual) return price + "/year";
    return price;
  })();

  return (
    <>
      <div className="flex justify-between">
        <Title level="h4" size="16">
          {title}
        </Title>
        <Text fontWeight="bold">
          <TextSpan>{priceString}</TextSpan>
        </Text>
      </div>
      <Card>
        <CartItemImages images={images} name={title} />
      </Card>
      <div className="flex flex-col gap-base">
        <Text color="background-color-tertiary">{description}</Text>
      </div>
    </>
  );
};
