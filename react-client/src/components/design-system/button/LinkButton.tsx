import { ComponentProps } from "react";
import { Link, LinkProps } from "react-router-dom";
import { classNames } from "~/util/styleUtil";
import { Button } from "./Button";

type ButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

type LinkButtonProps = Pick<
  LinkProps,
  "preventScrollReset" | "relative" | "replace" | "to"
> &
  ButtonProps & {
    openInNewTab?: boolean;
  };

export const LinkButton = ({
  preventScrollReset,
  relative,
  replace,
  openInNewTab,
  to,
  ...buttonProps
}: LinkButtonProps) => {
  const commonProps = {
    className: classNames("no-underline", {
      "w-full": buttonProps.fullWidth,
    }),
    tabIndex: -1,
  };

  const buttonElement = <Button variant="link" {...buttonProps} />;

  const isExternalLink = typeof to === "string" && to.startsWith("http");
  if (isExternalLink) {
    return (
      <a
        href={to}
        {...commonProps}
        rel="noopener noreferrer"
        target={openInNewTab ? "_blank" : undefined}
      >
        {buttonElement}
      </a>
    );
  }

  return (
    <Link
      {...commonProps}
      preventScrollReset={preventScrollReset}
      relative={relative}
      replace={replace}
      to={to}
    >
      {buttonElement}
    </Link>
  );
};
