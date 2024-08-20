import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "./IconButton";

type LinkIconButtonProps = ComponentProps<typeof Link> & {
  buttonProps: ComponentProps<typeof IconButton>;
};

export const LinkIconButton = ({
  buttonProps,
  ...linkProps
}: LinkIconButtonProps) => {
  return (
    <Link className="no-underline" {...linkProps}>
      <IconButton {...buttonProps} variant="link" />
    </Link>
  );
};
