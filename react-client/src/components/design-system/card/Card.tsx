import type { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

export type CardProps = {
  backgroundColor?: "blue-100" | "neutral-white";
  border?: "blue-100" | "neutral-300";
  children: ReactNode;
  radius?: "sm" | "base";
  role?: JSX.IntrinsicElements["div"]["role"];
  shadow?: "elevation-1" | "elevation-3";
};

export const Card = ({
  backgroundColor = "neutral-white",
  border = "neutral-300",
  children,
  radius = "base",
  role,
  shadow,
}: CardProps) => {
  return (
    <div
      className={classNames("overflow-hidden border border-solid", {
        "bg-blue-100": backgroundColor === "blue-100",
        "bg-neutral-white": backgroundColor === "neutral-white",
        "border-blue-100": border === "blue-100",
        "border-neutral-300": border === "neutral-300",
        "rounded-2xl": radius === "base",
        "rounded-xl": radius === "sm",
        "shadow-elevation-1": shadow === "elevation-1",
        "shadow-elevation-3": shadow === "elevation-3",
      })}
      role={role}
    >
      {children}
    </div>
  );
};
