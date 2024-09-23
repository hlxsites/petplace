import clsx from "clsx";
import { forwardRef } from "react";
import { safeIdFromText } from "~/util/misc";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputRadio,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputRadioProps = Omit<
  InputWithoutFormBuilderProps<ElementInputRadio>,
  "options" | "optionsType"
> & {
  onChange: (newValue: string) => void;
  options: string[];
  value: string;
};

export const InputRadio = forwardRef<HTMLInputElement, InputRadioProps>(
  ({ id, onChange, options, value, ...rest }, ref) => {
    return (
      <InputAccessibilityWrapper
        id={id}
        {...rest}
        labelProps={{ className: "pb-0" }}
      >
        {({ hasError }) => (
          <>
            {options.map((option) => {
              const optionId = safeIdFromText(`${id}-${option}`);
              return (
                <label
                  className="label flex w-fit cursor-pointer gap-small pl-0"
                  key={option}
                  htmlFor={optionId}
                >
                  <input
                    checked={option === value}
                    className={clsx("radio-primary radio", {
                      "radio-error": hasError,
                    })}
                    id={optionId}
                    name={id}
                    onChange={() => onChange?.(option)}
                    ref={ref}
                    type="radio"
                    value={option}
                  />
                  <span className="label-text">{option}</span>
                </label>
              );
            })}
          </>
        )}
      </InputAccessibilityWrapper>
    );
  }
);
