import { Link } from "react-router-dom";
import { IconButton } from "./IconButton";
import { ComponentProps } from "react";

type LinkIconButtonProps = ComponentProps<typeof Link> & {
  buttonProps: ComponentProps<typeof IconButton>;
};

export const LinkIconButton = ({
  buttonProps,
  ...linkProps
}: LinkIconButtonProps) => {
  return (
    <Link {...linkProps}>
      <IconButton {...buttonProps} variant="link" />
    </Link>
  );
};
