import { forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import useButtonBase, { type IUseButtonBase } from "./useButtonBase";

export type ButtonProps = IUseButtonBase &
  JSX.IntrinsicElements["button"] & {
    iconLeft?: IconProps;
    iconRight?: IconProps;
    onClick?: () => void;
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
      iconRight,
      ...rest
    },
    ref
  ) => {
    const { className: baseClassName } = useButtonBase({
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
        {iconLeft && renderIcon(iconLeft, "mr-base")}
        {children}
        {iconRight && renderIcon(iconRight, "ml-base")}
      </button>
    );

    function renderIcon(props: IconProps, className?: string) {
      return <Icon className={className} {...props} />;
    }
  }
);
