import { Icon, Text } from "../design-system";

export const CartHeader = () => {
  return (
    <div className="flex items-center">
      <Icon
        display="shoppingCart"
        className="mr-small text-orange-300-contrast"
      />
      <Text fontWeight="bold" size="xlg">
        My Cart
      </Text>
    </div>
  );
};