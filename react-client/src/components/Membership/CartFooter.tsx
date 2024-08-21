import { Button, Text } from "../design-system";

type CartFooterProps = { subtotal: string; proceedToCheckout?: () => void };

export const CartFooter = ({
  subtotal,
  proceedToCheckout,
}: CartFooterProps) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <div className="w-1/2">
          <Text fontWeight="bold" display="block">
            Subtotal
          </Text>
          <Text color="background-color-tertiary">
            Applicable taxes will be applied at checkout
          </Text>
        </div>
        <Text fontWeight="bold" size="xlg">
          {`$${subtotal}`}
        </Text>
      </div>

      <Button onClick={proceedToCheckout}>Proceed to checkout</Button>
    </>
  );
};
