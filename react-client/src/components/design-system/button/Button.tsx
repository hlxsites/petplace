import { forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import { Loading } from "../loading/Loading";
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
      disabled,
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
    const isDisabled = isLoading || disabled;

    const { className: baseClassName } = useButtonBase({
      disabled: isDisabled,
      fullWidth,
      isLoading,
      variant,
    });

    return (
      <button
        className={classNames(baseClassName, className)}
        disabled={isDisabled}
        ref={ref}
        type={type}
        {...rest}
      >
        {iconLeft && renderIcon({ display: iconLeft, className: "mr-small" })}
        {isLoading ? <Loading size={16} /> : children}
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
