import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "./IconButton";

type LinkIconButtonProps = ComponentProps<typeof Link> & {
  buttonProps: Omit<ComponentProps<typeof IconButton>, "label">;
  label: string;
};

export const LinkIconButton = ({
  buttonProps,
  label,
  ...linkProps
}: LinkIconButtonProps) => {
  return (
    <Link aria-label={label} className="no-underline" {...linkProps}>
      <IconButton
        {...buttonProps}
        // We don't want the button to have a label, as the link already has one
        label=""
        variant="link"
      />
    </Link>
  );
};
