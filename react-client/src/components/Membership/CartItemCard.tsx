import { CartItem } from "~/domain/models/cart/CartModel";
import { Card, Text } from "../design-system";
import { CartItemQuantityManager } from "./CartItemQuantityManager";

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
    <Card role="listitem">
      <div className="flex flex-col gap-base p-base">
        <div className="flex justify-between">
          <div>
            <Text display="block" fontWeight="bold" size="18">
              {name}
            </Text>
            <Text color="background-color-tertiary" size="14">
              {description}
            </Text>
          </div>
          <div>
            <Text fontWeight="bold" size="20">
              {price}
            </Text>
          </div>
        </div>

        {isService && (
          <div className="flex justify-between">
            <Text color="background-color-tertiary">{recurrence}</Text>
            <Text color="orange-300-contrast" fontWeight="bold" size="14">
              {acquisitionMessage}
            </Text>
          </div>
        )}
        {!isService && <CartItemQuantityManager {...rest} />}
      </div>
    </Card>
  );
};
