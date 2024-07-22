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
  const handleOnClick = (newValue: boolean) => () => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (value === newValue) return;
      onChange?.(newValue);
    };
  };

  const hasValue = value !== undefined;
  return (
    <InputAccessibilityWrapper id={id} {...rest}>
      {({ inputProps }) => (
        <>
          <div aria-hidden="true" className="join">
            <Button
              className="join-item"
              onClick={handleOnClick(false)}
              variant={hasValue ? "secondary" : "primary"}
            >
              No
            </Button>
            <Button
              className="join-item"
              onClick={handleOnClick(true)}
              variant={hasValue ? "primary" : "secondary"}
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
