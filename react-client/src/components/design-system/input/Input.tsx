import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import { useState } from "react";

interface InputProps {
  "data-testid"?: string;
  disabled?: boolean;
  error?: any;
  errorMessage?: string;
  id: string;
  iconLeft?: IconProps;
  iconRight?: IconProps;
  label?: string;
  message?: string;
  onChange?: () => void;
  placeholder?: string;
  squared?: boolean;
  type?: string;
}

const Input = ({
  "data-testid": testId,
  disabled,
  error,
  errorMessage,
  message,
  id,
  iconLeft,
  iconRight,
  label,
  squared,
  type = "text",
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="text-xs font-medium">
          {label}
        </label>
      )}
      <div
        className={classNames(
          "my-[12px] flex w-fit rounded-full border-[1px] border-solid bg-neutral-white px-base",
          {
            "rounded-lg": squared,
            "border-2 border-brand-main": isFocused,
            "bg-background-disabled": disabled,
            "border-text-danger-default": hasError,
          }
        )}
      >
        {iconLeft && renderIcon(iconLeft)}

        <input
          id={id}
          className={classNames(
            "min-w-300 ml-small h-12 rounded-full bg-neutral-white py-[0px] outline-none placeholder:text-text-hinted disabled:bg-background-disabled disabled:text-text-disabled",
            {
              "text-text-danger-default": hasError,
            }
          )}
          data-testid={testId}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {iconRight && renderIcon(iconRight, "ml-base")}
      </div>
      {hasError && (
        <span className="text-text-danger-default block text-xs">
          {errorMessage}
        </span>
      )}
      {message && (
        <div className="text-brand-blue flex items-center">
          <Icon display="information" size={16} />{" "}
          <span className="ml-small block text-xs">{message}</span>
        </div>
      )}
    </div>
  );

  function renderIcon(props: IconProps, className?: string) {
    return (
      <div
        className={classNames("flex items-center rounded-full bg-transparent", {
          "text-text-danger-default": hasError,
        })}
      >
        <Icon className={className} {...props} />
      </div>
    );
  }
};
export default Input;
