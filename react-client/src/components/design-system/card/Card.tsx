import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

export type CardProps = {
  children: ReactNode;
  hasShadow?: boolean;
  radius?: "sm" | "base";
  role?: JSX.IntrinsicElements["div"]["role"];
};

export const Card = ({
  children,
  hasShadow,
  radius = "base",
  role,
}: CardProps) => {
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
      role={role}
    >
      {children}
    </div>
  );
};
