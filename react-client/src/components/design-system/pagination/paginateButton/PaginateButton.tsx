import type { ReactNode } from "react";
import { Button } from "../../button/Button";
import { classNames } from "~/util/styleUtil";

type PaginateButtonProps = {
  ariaLabel: string;
  className?: string;
  children: ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

export const PaginateButton = ({
  ariaLabel,
  className,
  children,
  isDisabled = false,
  isSelected = false,
  onClick,
}: PaginateButtonProps) => (
  <Button
    aria-label={ariaLabel}
    className={classNames(
      "inline px-[9px] py-[2px] hover:text-orange-500 focus:outline-none disabled:bg-transparent disabled:hover:bg-transparent",
      {
        "text-orange-300-contrast": isSelected,
        "text-neutral-400": isDisabled,
      },
      className
    )}
    disabled={isDisabled || isSelected}
    onClick={onClick}
    variant="link"
  >
    {children}
  </Button>
);
