import { Text, Title } from "~/components/design-system";
import { ButtonWithBadge } from "~/components/design-system/button/ButtonWithBadge";

export const AdditionalProtectionSection = () => {
  return (
    <div className="relative flex w-full justify-between">
      <div>
        <Title level="h3" isResponsive>
          Secure Your Pet's Protection Plan
        </Title>
        <Text isResponsive size="18">
          Add Additional Products, and Confirm Opt-ins and Terms for
          Comprehensive Pet Safety.
        </Text>
      </div>
      <div className="absolute bottom-[160px] right-10 lg:bottom-0">
        <ButtonWithBadge
          iconProps={{ className: "text-orange-300-contrast" }}
          iconLeft="shoppingCart"
          badge={2}
        >
          Shopping cart
        </ButtonWithBadge>
      </div>
    </div>
  );
};
