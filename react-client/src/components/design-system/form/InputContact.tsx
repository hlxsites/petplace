import { forwardRef, type ChangeEvent } from "react";
import { classNames } from "~/util/styleUtil";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import Select from "./Select";
import {
  type ElementInputContact,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";
import { FORM_STYLES } from "./utils/formStyleUtils";

type InputContactProps = InputWithoutFormBuilderProps<ElementInputContact> & {
  disableSelect?: boolean;
  hideSelect?: boolean;
  defaultSelect?: string;
};

const selectOptions = ["Home", "Work"];

export const InputContact = forwardRef<HTMLInputElement, InputContactProps>(
  (
    {
      autoFocus,
      disableSelect,
      defaultSelect,
      hideSelect,
      id,
      onChange,
      placeholder,
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
            <div className="flex gap-medium">
              {!hideSelect && (
                <Select
                  id="contact-category"
                  label="Contact category"
                  hideLabel
                  options={selectOptions}
                  disabled={disableSelect}
                  value={defaultSelect}
                />
              )}
              <div
                className={classNames(FORM_STYLES.inputRoot, {
                  "bg-background-disabled": rest.disabled,
                  "border-text-danger-default": hasError,
                })}
                data-testid="input-container"
              >
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
                  value={value}
                  {...inputProps}
                />
              </div>
            </div>
          );
        }}
      </InputAccessibilityWrapper>
    );
  }
);
