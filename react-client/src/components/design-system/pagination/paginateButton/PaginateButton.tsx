import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import { Button } from "../../button/Button";

type PaginateButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick: () => void;
};

export const PaginateButton = ({
  ariaLabel,
  children,
  isDisabled = false,
  isSelected = false,
  onClick,
}: PaginateButtonProps) => (
  <Button
    aria-current={isSelected ? "page" : undefined}
    aria-label={ariaLabel}
    className={classNames(
      "flex items-center !px-xsmall !py-xsmall hover:text-orange-500 focus:outline-none disabled:bg-transparent disabled:hover:bg-transparent",
      {
        "text-orange-300-contrast": isSelected,
        "text-neutral-400": isDisabled,
      }
    )}
    disabled={isDisabled || isSelected}
    onClick={onClick}
    variant="link"
  >
    {children}
  </Button>
);
