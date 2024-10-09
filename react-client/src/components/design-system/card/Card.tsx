import { classNames } from "~/util/styleUtil";
import { CardProps } from "../types/CardTypes";

export const Card = ({
  backgroundColor = "bg-neutral-white",
  border = "border-neutral-200",
  children,
  overflow = "hidden",
  padding,
  radius = "base",
  shadow,
  ...rest
}: CardProps) => {
  return (
    <div
      className={classNames("border border-solid", backgroundColor, border, {
        "rounded-2xl": radius === "base",
        "rounded-xl": radius === "sm",
        "shadow-elevation-1": shadow === "elevation-1",
        "shadow-elevation-3": shadow === "elevation-3",
        "p-medium": padding === "medium",
        "p-base": padding === "base",
        "p-large": padding === "large",
        "p-xlarge": padding === "xlarge",
        "p-xxlarge": padding === "xxlarge",
        "overflow-hidden": overflow === "hidden",
        "overflow-visible": overflow === "visible",
        "overflow-scroll": overflow === "scroll",
        "overflow-auto": overflow === "auto",
      })}
      {...rest}
    >
      {children}
    </div>
  );
};
