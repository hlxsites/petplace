import { CartItem } from "~/domain/models/cart/CartModel";
import { CHECKOUT_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { Card, LinkButton, Text } from "../design-system";
import { CartItemQuantityManager } from "./CartItemQuantityManager";

type CartItemCardProps = Omit<CartItem, "autoRenew" | "type">;
export const CartItemCard = ({
  description,
  isService,
  name,
  petId,
  price,
  recurrence,
  ...rest
}: CartItemCardProps) => {
  const onUpdateQuantity = (id: string, quantity: number) => {
    // TODO: implement it
    console.log(id, quantity);
  };

  return (
    <Card role="listitem">
      <div className="flex flex-col gap-base p-base">
        <div className="flex justify-between">
          <div>
            <Text display="block" fontWeight="bold" size="18">
              {name}
            </Text>
            {description && (
              <Text color="background-color-tertiary" size="14">
                {description}
              </Text>
            )}
          </div>
          <div>
            <Text fontWeight="bold" size="20">
              {`$${price}`}
            </Text>
          </div>
        </div>

        {isService && (
          <div className="flex justify-between">
            <Text color="background-color-tertiary">{recurrence}</Text>
            <LinkButton
              className="text-14 font-bold text-orange-300-contrast"
              to={CHECKOUT_FULL_ROUTE(`${petId}`)}
            >
              Change membership plan
            </LinkButton>
          </div>
        )}
        {!isService && (
          <CartItemQuantityManager
            {...rest}
            onUpdateQuantity={onUpdateQuantity}
          />
        )}
      </div>
    </Card>
  );
};
