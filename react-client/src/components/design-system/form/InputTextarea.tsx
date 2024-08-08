import clsx from "clsx";
import { forwardRef, type ChangeEvent } from "react";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputText,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputTextareaProps = InputWithoutFormBuilderProps<ElementInputText>;

export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputTextareaProps
>(({ autoFocus, id, onChange, placeholder, value, ...rest }, ref) => {
  const handleOnChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(target.value);
  };

  return (
    <InputAccessibilityWrapper id={id} {...rest}>
      {({ hasError, inputProps }) => (
        <textarea
          autoFocus={autoFocus}
          className={clsx("textarea textarea-bordered h-24 w-full", {
            "textarea-error": hasError,
          })}
          id={id}
          name={id}
          onChange={handleOnChange}
          placeholder={placeholder}
          ref={ref}
          value={value}
          {...inputProps}
        />
      )}
    </InputAccessibilityWrapper>
  );
});
