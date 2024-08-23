import { ReactNode } from "react";
import { Button, Card, Text, Title } from "../design-system";

type CheckoutProductCardProps = {
  isAnnual?: boolean;
  onClick?: () => void;
  price: string;
  product: ReactNode;
  productSpecifications?: ReactNode;
  title: string;
};

export const CheckoutProductCard = ({
  isAnnual,
  onClick,
  price,
  product,
  productSpecifications,
  title,
}: CheckoutProductCardProps) => {
  return (
    <Card border="border-border-base-color">
      <div className="flex flex-col gap-large p-large">
        <div className="flex justify-between">
          <Title level="h4">{title}</Title>
          <div className="flex flex-col text-right">
            <Text fontWeight="bold" size="xlg">
              {price}
            </Text>
            {isAnnual && (
              <Text fontWeight="bold" size="xs">
                /year
              </Text>
            )}
          </div>
        </div>
        <Card border="border-border-base-color">{product}</Card>
        <div className="h-[58px]">{productSpecifications}</div>
        <div className="grid w-full gap-xsmall">
          <Button fullWidth onClick={onClick} variant="tertiary">
            Add to cart
          </Button>
          <Button
            className="text-orange-300-contrast"
            fullWidth
            onClick={onClick}
            variant="link"
          >
            More info
          </Button>
        </div>
      </div>
    </Card>
  );
};
