import classNames from "classnames";
import { forwardRef } from "react";
import type { IconKeys, IconProps } from "../icon/Icon";
import { Icon } from "../icon/Icon";
import useButtonBase, { type IUseButtonBase } from "./useButtonBase";

export type IconButtonProps = IUseButtonBase &
  Omit<JSX.IntrinsicElements["button"], "children"> & {
    label: string;
    icon?: IconKeys;
    iconProps?: Omit<IconProps, "display">;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
  };

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      iconProps,
      isFullWidth,
      isLoading,
      label,
      type = "button",
      variant,
      ...rest
    }: IconButtonProps,
    ref
  ) => {
    const { className: baseClassName } = useButtonBase({
      isFullWidth,
      isLoading,
      variant,
    });

    return (
      <button
        aria-label={label}
        className={classNames(
          baseClassName,
          "btn-square mx-1 min-w-0 px-[12px] py-0",
          className
        )}
        type={type}
        ref={ref}
        {...rest}
      >
        <Icon
          display={icon}
          fixedWidth
          {...iconProps}
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
