import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

interface CardProps {
  "aria-label"?: string;
  children: ReactNode;
  "data-testid"?: string;
  onClick?: () => void;
  hasShadow?: boolean;
  radius?: "sm" | "base";
}

const Card = ({
  "aria-label": ariaLabel,
  children,
  "data-testid": testId = "Card",
  onClick,
  hasShadow,
  radius = "base"
}: CardProps) => {
  const borderRadius = radius === "base" ? "rounded-2xl" : "rounded-xl"
  return (
    <div
      aria-label={ariaLabel}
      className={classNames("border border-solid border-[#d0d0d6] bg-neutral-white w-fit", borderRadius, hasShadow && "shadow-elevation-1")}
      data-testid={testId}
      onClick={onClick}
      role={onClick && "button"}
    >
        {children}
    </div>
  );
};

export default Card;
