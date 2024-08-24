import { ComponentProps } from "react";
import { plural } from "~/util/stringUtil";
import { Button } from "./Button";

type ButtonProps = ComponentProps<typeof Button>;

type ButtonWithBadgeProps = ButtonProps & {
  badge?: number;
};

export const ButtonWithBadge = ({
  badge,
  ...buttonProps
}: ButtonWithBadgeProps) => {
  return (
    <span className="relative">
      <Button fullWidth variant="secondary" {...buttonProps} />

      {renderBadge()}
    </span>
  );

  function renderBadge() {
    if (!badge || badge <= 0) return null;
    return (
      <div
        aria-label={plural({
          countFrom: badge,
          one: "1 item",
          other: `${badge} items`,
        })}
        className="font-['Libre Franklin'] absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-[100px] bg-orange-300-contrast text-xs text-white"
        role="status"
      >
        {badge}
      </div>
    );
  }
};
