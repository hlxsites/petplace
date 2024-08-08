import { type MouseEvent } from "react";
import { Button } from "../button/Button";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputBoolean,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputBooleanProps = InputWithoutFormBuilderProps<ElementInputBoolean>;

export const InputBoolean = ({
  id,
  onChange,
  value,
  ...rest
}: InputBooleanProps) => {
  const handleOnClick =
    (newValue: boolean) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (value === newValue) return;
      onChange?.(newValue);
    };

  return (
    <InputAccessibilityWrapper id={id} {...rest}>
      {({ inputProps }) => (
        <>
          <div className="flex h-12">
            <Button
              className="rounded-lg rounded-br-none rounded-tr-none"
              onClick={handleOnClick(false)}
              variant={value ? "secondary" : "primary"}
            >
              No
            </Button>
            <Button
              className="rounded-lg rounded-bl-none rounded-tl-none"
              onClick={handleOnClick(true)}
              variant={value ? "primary" : "secondary"}
            >
              Yes
            </Button>
          </div>
          <input
            className="sr-only"
            defaultChecked={!!value}
            id={id}
            onChange={() => {
              onChange?.(!value);
            }}
            name={id}
            type="checkbox"
            {...inputProps}
          />
        </>
      )}
    </InputAccessibilityWrapper>
  );
};
