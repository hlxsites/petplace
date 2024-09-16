import { forwardRef } from "react";
import { safeIdFromText } from "~/util/misc";
import { Checkbox } from "../checkbox/Checkbox";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputCheckboxGroup,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputCheckboxGroupProps = Omit<
  InputWithoutFormBuilderProps<ElementInputCheckboxGroup>,
  "options" | "optionsType"
> & {
  onChange?: (newValue: string[]) => void;
  options: string[];
  value?: string[];
};

export const InputCheckboxGroup = forwardRef<
  HTMLButtonElement,
  InputCheckboxGroupProps
>(({ id, onChange, options, value, variant, ...rest }, ref) => {
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
      {({ inputProps }) => (
        <>
          {options.map((option) => {
            const optionId = safeIdFromText(`${id}-${option}`);

            return (
              <Checkbox
                checked={value?.includes(option)}
                id={optionId}
                key={optionId}
                label={option}
                name={optionId}
                onCheckedChange={handleOnChange(option)}
                ref={ref}
                value={option}
                variant={variant}
              />
            );
          })}
          <input {...inputProps} type="hidden" value={value?.join(";") ?? ""} />
        </>
      )}
    </InputAccessibilityWrapper>
  );
});
