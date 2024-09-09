import { classNames } from "~/util/styleUtil";
import { CardProps } from "../types/CardTypes";

export const Card = ({
  backgroundColor = "bg-neutral-white",
  border = "border-neutral-300",
  children,
  padding,
  radius = "base",
  shadow,
  ...rest
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
          "p-base": padding === "base",
          "p-large": padding === "large",
          "p-xlarge": padding === "xlarge",
          "p-xxlarge": padding === "xxlarge",
        }
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
