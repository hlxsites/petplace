import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { Card, Text, TextSpan, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";

export const CheckoutServiceCard = ({
  name,
  price,
  isAnnual,
  images,
  description,
}: CheckoutServices) => {
  return (
    <>
      <div className="flex justify-between">
        <Title level="h5">{name}</Title>
        <Text fontWeight="bold">
          <TextSpan>{price}</TextSpan>
          {`${isAnnual ? "/year" : ""}`}
        </Text>
      </div>
      <Card>
        <CartItemImages images={images} name={name} />
      </Card>
      <div className="flex flex-col gap-base">
        <Text color="background-color-tertiary">{description}</Text>
      </div>
    </>
  );
};
