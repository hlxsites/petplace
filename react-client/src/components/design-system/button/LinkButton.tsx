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
  const isExternalLink = typeof to === "string" && to.startsWith("http");

  if (isExternalLink) {
    return (
      <a
        href={to}
        className={classNames("no-underline", {
          "w-full": buttonProps.fullWidth,
        })}
        target={openInNewTab ? "_blank" : undefined}
        rel="noopener noreferrer"
        tabIndex={-1}
      >
        <Button variant="link" {...buttonProps} />
      </a>
    );
  }

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
