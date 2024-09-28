import { Button, Text } from "../design-system";

type CartFooterProps = {
  onClick?: () => void;
  subtotal: string;
};

export const CartFooter = ({ onClick, subtotal }: CartFooterProps) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <div className="w-1/2">
          <Text display="block" fontWeight="bold" size="18">
            Subtotal
          </Text>
          <Text color="background-color-tertiary">
            Applicable taxes will be applied at checkout
          </Text>
        </div>
        <Text fontWeight="bold" size="32">
          {`$${subtotal}`}
        </Text>
      </div>

      <Button onClick={onClick}>Proceed to checkout</Button>
    </>
  );
};
