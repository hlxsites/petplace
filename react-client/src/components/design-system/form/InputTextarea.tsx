import { forwardRef, type ChangeEvent } from "react";
import { classNames } from "~/util/styleUtil";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputTextarea,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";
import { FORM_STYLES } from "./utils/formStyleUtils";

type InputTextareaProps = InputWithoutFormBuilderProps<ElementInputTextarea>;

export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputTextareaProps
>(({ autoFocus, id, onChange, placeholder, rows = 4, value, ...rest }, ref) => {
  const handleOnChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(target.value);
  };

  return (
    <InputAccessibilityWrapper id={id} {...rest}>
      {({ hasError, inputProps }) => (
        <textarea
          autoFocus={autoFocus}
          className={classNames(FORM_STYLES.inputRoot, FORM_STYLES.input, {
            "bg-background-disabled": rest.disabled,
            "border-text-danger-default": hasError,
            [FORM_STYLES.inputError]: hasError,
          })}
          id={id}
          name={id}
          onChange={handleOnChange}
          placeholder={placeholder}
          ref={ref}
          rows={rows}
          value={value}
          {...inputProps}
        />
      )}
    </InputAccessibilityWrapper>
  );
});
