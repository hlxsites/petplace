import { ComponentProps } from "react";
import { Link, LinkProps } from "react-router-dom";
import { classNames } from "~/util/styleUtil";
import { Button } from "./Button";

type ButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

type LinkButtonProps = Pick<
  LinkProps,
  "preventScrollReset" | "relative" | "replace" | "to"
> &
  ButtonProps;

export const LinkButton = ({
  preventScrollReset,
  relative,
  replace,
  to,
  ...buttonProps
}: LinkButtonProps) => {
  return (
    <Link
      className={classNames("no-underline", {
        "w-full": buttonProps.fullWidth,
      })}
      preventScrollReset={preventScrollReset}
      relative={relative}
      replace={replace}
      tabIndex={-1}
      to={to}
    >
      <Button variant="link" {...buttonProps} />
    </Link>
  );
};
