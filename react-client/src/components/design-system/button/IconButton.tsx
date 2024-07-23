import { forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import useButtonBase, { type UseButtonBase } from "./useButtonBase";

type IconButtonProps = UseButtonBase &
  Omit<JSX.IntrinsicElements["button"], "children" | "fullWidth"> & {
    label: string;
    icon: IconProps["display"];
    iconProps?: Omit<IconProps, "display">;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      iconProps,
      isLoading,
      label,
      type = "button",
      variant,
      ...rest
    }: IconButtonProps,
    ref
  ) => {
    const { className: baseClassName } = useButtonBase({
      isLoading,
      variant,
    });

    return (
      <button
        aria-label={label}
        className={classNames(
          baseClassName,
          "btn-square mx-1 px-medium min-w-0 py-0",
          className
        )}
        type={type}
        ref={ref}
        {...rest}
      >
        <Icon className="max-h-full max-w-full" display={icon} {...iconProps} />
      </button>
    );
  }
);
