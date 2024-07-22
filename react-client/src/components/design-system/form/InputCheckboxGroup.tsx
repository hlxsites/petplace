import clsx from "clsx";
import { forwardRef } from "react";
import { safeIdFromText } from "~/util/misc";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputCheckboxGroup,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputCheckboxGroupProps = Omit<
  InputWithoutFormBuilderProps<ElementInputCheckboxGroup>,
  "options" | "optionsType"
> & {
  options: string[];
};

export const InputCheckboxGroup = forwardRef<
  HTMLInputElement,
  InputCheckboxGroupProps
>(({ id, onChange, options, value, ...rest }, ref) => {
  const handleOnChange = (option: string) => {
    return () => {
      if (value?.includes(option)) {
        onChange?.(value?.filter((v) => v !== option));
      } else {
        onChange?.([...(value ?? []), option]);
      }
    };
  };

  return (
    <InputAccessibilityWrapper
      id={id}
      {...rest}
      labelProps={{ className: "pb-0" }}
    >
      {({ hasError, inputProps }) => (
        <>
          {options.map((option) => {
            const optionId = safeIdFromText(`${id}-${option}`);
            return (
              <label
                className="label gap-2 w-fit cursor-pointer pl-0"
                key={option}
                htmlFor={optionId}
              >
                <input
                  checked={value?.includes(option)}
                  className={clsx("checkbox-primary checkbox", {
                    "checkbox-error": hasError,
                  })}
                  id={optionId}
                  name={optionId}
                  onChange={handleOnChange(option)}
                  ref={ref}
                  type="checkbox"
                  value={option}
                />
                <span className="label-text">{option}</span>
              </label>
            );
          })}
          <input {...inputProps} type="hidden" value={value?.join(";") ?? ""} />
        </>
      )}
    </InputAccessibilityWrapper>
  );
});
