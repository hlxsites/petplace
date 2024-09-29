import { forwardRef, type ChangeEvent } from "react";
import { classNames } from "~/util/styleUtil";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import Select from "./Select";
import {
  AVAILABLE_PHONE_TYPES,
  type ElementInputPhone,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";
import { FORM_STYLES } from "./utils/formStyleUtils";

type InputPhoneProps = Omit<
  InputWithoutFormBuilderProps<ElementInputPhone>,
  "disabledType" | "hideType"
> & {
  defaultType?: string;
  disabledType?: boolean;
  hideType?: boolean;
  onChange: (newValue: string) => void;
  value: string;
};

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
  (
    {
      autoFocus,
      defaultType,
      disabledType,
      disallowedTypes,
      hideType,
      id,
      onChange,
      placeholder,
      value: combinedValue,
      ...rest
    },
    ref
  ) => {
    const [value, type] = combinedValue?.split("|") || ["", ""];

    const selectedType = (() => {
      if (type) return type;
      if (defaultType) return defaultType;
      return "";
    })();

    const handleOnChange = ({
      newType,
      newValue,
    }: {
      newType?: string;
      newValue?: string;
    }) => {
      const newCombinedValue = `${newValue ?? value}|${newType ?? selectedType}`;
      onChange(newCombinedValue);
    };

    const handleOnChangeType = (newType: string) => {
      handleOnChange({ newType });
    };

    const handleOnChangeInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
      handleOnChange({ newValue: target.value });
    };

    const phoneTypeOptions: string[] = (() => {
      const options = [...AVAILABLE_PHONE_TYPES];
      if (disallowedTypes) {
        return options.filter((t) => !disallowedTypes.includes(t));
      }
      return options;
    })();

    return (
      <InputAccessibilityWrapper id={id} {...rest}>
        {({ hasError, inputProps }) => {
          return (
            <div className="flex gap-medium">
              {!hideType && (
                <Select
                  autoComplete="off"
                  disabled={disabledType}
                  hideLabel
                  id="phone-category"
                  label="Contact category"
                  placeholder="Choose"
                  options={phoneTypeOptions}
                  onChange={handleOnChangeType}
                  value={selectedType}
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
                  onChange={handleOnChangeInput}
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
