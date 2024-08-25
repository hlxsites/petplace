import { ComponentProps } from "react";
import { Button } from "~/components/design-system";

type OnboardingPrimaryButtonProps = Pick<
  ComponentProps<typeof Button>,
  "children" | "disabled" | "onClick"
>;

export const OnboardingPrimaryButton = ({
  children,
  ...rest
}: OnboardingPrimaryButtonProps) => {
  return (
    <Button className="disabled:text-neutral-500" fullWidth {...rest}>
      {children}
    </Button>
  );
};
