import { ComponentProps } from "react";
import { Link, LinkProps } from "react-router-dom";
import { classNames } from "~/util/styleUtil";
import ExternalLink from "../anchor/ExternalLink";
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
  };

  const buttonElement = <Button variant="link" {...buttonProps} />;

  const isExternalLink = typeof to === "string" && to.startsWith("http");
  if (isExternalLink) {
    return (
      <ExternalLink href={to} openInNewTab={openInNewTab} {...commonProps}>
        {buttonElement}
      </ExternalLink>
    );
  }

  const isMailOrTelLink =
    typeof to === "string" && (to.startsWith("mailto") || to.startsWith("tel"));
  if (isMailOrTelLink) {
    return (
      <a href={to} {...commonProps}>
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
