import { forwardRef, type ChangeEvent } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputText,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";
import { FORM_STYLES } from "./utils/formStyleUtils";

type InputProps = InputWithoutFormBuilderProps<ElementInputText> & {
  iconLeft?: IconProps;
  iconRight?: IconProps;
  onChange?: (newValue: string) => void;
  type?: "text" | "email" | "password" | "number";
  value?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      autoFocus,
      iconLeft,
      iconRight,
      id,
      onChange,
      placeholder,
      type = "text",
      value,
      ...rest
    },
    ref
  ) => {
    const handleOnChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange?.(target.value);
    };

    return (
      <InputAccessibilityWrapper id={id} {...rest}>
        {({ hasError, inputProps }) => {
          return (
            <div
              className={classNames(FORM_STYLES.inputRoot, {
                "bg-background-disabled": rest.disabled,
                "border-text-danger-default": hasError,
              })}
              data-testid="input-container"
            >
              {iconLeft && renderIcon(iconLeft, "ml-base")}

              <input
                autoFocus={autoFocus}
                className={classNames(
                  FORM_STYLES.input,
                  "text-base border-none",
                  {
                    [FORM_STYLES.inputError]: hasError,
                  }
                )}
                id={id}
                name={id}
                onChange={handleOnChange}
                placeholder={placeholder}
                ref={ref}
                type={type}
                value={value}
                {...inputProps}
              />
              {iconRight && renderIcon(iconRight, "mr-base")}
            </div>
          );

          function renderIcon(props: IconProps, className?: string) {
            return (
              <div
                className={classNames(
                  "flex items-center rounded-full bg-transparent",
                  {
                    "text-text-danger-default": hasError,
                  }
                )}
              >
                <Icon className={className} {...props} size={20} />
              </div>
            );
          }
        }}
      </InputAccessibilityWrapper>
    );
  }
);

Input.displayName = "Input";

export default Input;
