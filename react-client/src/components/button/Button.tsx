import useButtonBase, { type IUseButtonBase } from "./useButtonBase";
import { Icon } from "../icon/Icon";
import { classNames } from "../../util/util";

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
      {iconLeft && getIcon("pr-base")}
      {children}
      {iconRight && getIcon("pl-base")}
    </button>
  );

  function getIcon(classes?: string) {
    return <Icon className={classes} display="heart" />;
  }
};

export default Button;
