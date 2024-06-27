import { classNames } from "../../util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import useButtonBase, { type IUseButtonBase } from "./useButtonBase";

export type IButtonProps = IUseButtonBase &
  JSX.IntrinsicElements["button"] & {
    onClick?: () => void;
  };

const Button = ({
  children,
  className,
  isFullWidth,
  isLoading,
  type = "button",
  variant,
  iconLeft,
  iconRight,
  ...rest
}: IButtonProps) => {
  const { className: baseClassName } = useButtonBase({
    isFullWidth,
    isLoading,
    variant,
  });

  return (
    <button
      className={classNames(baseClassName, className)}
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
};

export default Button;
