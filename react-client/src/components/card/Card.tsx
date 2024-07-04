import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

type CardProps = {
  children: ReactNode;
  hasShadow?: boolean;
  radius?: "sm" | "base";
};

const Card = ({ children, hasShadow, radius = "base" }: CardProps) => {
  return (
    <div
      className={classNames(
        "bg-neutral-white w-fit border border-solid border-[#d0d0d6]",
        {
          "rounded-2xl": radius === "base",
          "rounded-xl": radius === "sm",
          "shadow-elevation-1": hasShadow,
        }
      )}
    >
      {children}
    </div>
  );
};

export default Card;
