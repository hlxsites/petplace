import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

type CardProps = {
  children: ReactNode;
  hasShadow?: boolean;
  radius?: "sm" | "base";
};

export const Card = ({ children, hasShadow, radius = "base" }: CardProps) => {
  return (
    <div
      className={classNames(
        "overflow-hidden border border-solid border-[#d0d0d6] bg-neutral-white",
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
