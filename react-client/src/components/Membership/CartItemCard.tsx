import { Card, Text } from "../design-system";
import { CartItemQuantityManager } from "./CartItemQuantityManager";
import { CartItem } from "./utils/cartTypes";

type CartItemCardProps = CartItem & {
  onUpdateQuantity: (id: string, value: number) => void;
};

export const CartItemCard = ({
  acquisitionMessage,
  description,
  name,
  price,
  recurrence,
  type,
  ...rest
}: CartItemCardProps) => {
  const isService = type === "service";

  return (
    <Card>
      <div className="flex flex-col gap-base p-base">
        <div className="flex justify-between">
          <div>
            <Text size="base" fontWeight="bold" display="block">
              {name}
            </Text>
            <Text color="background-color-tertiary">{description}</Text>
          </div>
          <div>
            <Text size="base" fontWeight="bold">
              {price}
            </Text>
          </div>
        </div>

        {isService && (
          <div className="flex justify-between">
            <Text color="background-color-tertiary">{recurrence}</Text>
            <Text fontWeight="bold" color="orange-300-contrast">
              {acquisitionMessage}
            </Text>
          </div>
        )}
        {!isService && <CartItemQuantityManager {...rest} />}
      </div>
    </Card>
  );
};
