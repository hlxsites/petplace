import { classNames } from "~/util/styleUtil";
import { CardProps } from "../types/CardTypes";

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
      className={classNames(
        "overflow-hidden border border-solid",
        backgroundColor,
        border,
        {
          "rounded-2xl": radius === "base",
          "rounded-xl": radius === "sm",
          "shadow-elevation-1": shadow === "elevation-1",
          "shadow-elevation-3": shadow === "elevation-3",
        }
      )}
      role={role}
    >
      {children}
    </div>
  );
};
