import classNames from "classnames";
import useButtonBase, { type IUseButtonBase } from "./useButtonBase";
import { Icon } from "../icon/Icon";

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
      <>
        {iconLeft && getIcon("pr-base")}
        {children}
        {iconRight && getIcon("pl-base")}
      </>
    </button>
  );

  function getIcon(classes?: string) {
    const className = children ? classes : "";
    return <Icon className={className} />;
  }
};

export default Button;
