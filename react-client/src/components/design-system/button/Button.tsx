import { forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import useButtonBase, { type UseButtonBase } from "./useButtonBase";

type ButtonIcon = IconProps["display"];

export type ButtonProps = UseButtonBase &
  JSX.IntrinsicElements["button"] & {
    iconLeft?: ButtonIcon;
    iconProps?: Omit<IconProps, "display">;
    iconRight?: ButtonIcon;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      fullWidth,
      isLoading,
      type = "button",
      variant,
      iconLeft,
      iconProps,
      iconRight,
      ...rest
    },
    ref
  ) => {
    const { className: baseClassName } = useButtonBase({
      disabled: rest.disabled,
      fullWidth,
      isLoading,
      variant,
    });

    return (
      <button
        className={classNames(baseClassName, className)}
        ref={ref}
        type={type}
        {...rest}
      >
        {iconLeft && renderIcon({ display: iconLeft, className: "mr-small" })}
        {children}
        {iconRight && renderIcon({ display: iconRight, className: "ml-small" })}
      </button>
    );

    function renderIcon(props: IconProps) {
      return (
        <Icon
          size={16}
          {...props}
          {...iconProps}
          className={classNames(props.className, iconProps?.className)}
        />
      );
    }
  }
);
