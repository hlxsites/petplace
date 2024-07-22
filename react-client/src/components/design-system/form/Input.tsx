import { forwardRef, type ChangeEvent } from "react";
import { classNames } from "~/util/styleUtil";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputText,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputProps = InputWithoutFormBuilderProps<ElementInputText> & {
  type?: "text" | "email" | "password" | "number";
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { autoFocus, id, onChange, placeholder, type = "text", value, ...rest },
    ref
  ) => {
    const handleOnChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange?.(target.value);
    };

    return (
      <InputAccessibilityWrapper id={id} {...rest}>
        {({ hasError, inputProps }) => (
          <input
            autoFocus={autoFocus}
            className={classNames("input input-md input-bordered w-full", {
              "input-error": hasError,
            })}
            id={id}
            name={id}
            onChange={handleOnChange}
            placeholder={placeholder}
            ref={ref}
            type={type}
            value={value}
            {...inputProps}
          />
        )}
      </InputAccessibilityWrapper>
    );
  }
);

Input.displayName = "Input";

export default Input;
