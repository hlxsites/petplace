import { forwardRef } from "react";
import { Switch } from "../switch/Switch";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputSwitch,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputSwitchProps = InputWithoutFormBuilderProps<ElementInputSwitch> & {
  onChange: (newValue: boolean) => void;
  label: string;
  value: boolean;
};

export const InputSwitch = forwardRef<HTMLButtonElement, InputSwitchProps>(
  (
    {
      conditionalLabel,
      hideLabel,
      id,
      label,
      onChange,
      value,
      variant,
      ...rest
    },
    ref
  ) => {
    const newLabel =
      (value ? conditionalLabel?.[0] : conditionalLabel?.[1]) ?? label;

    return (
      <InputAccessibilityWrapper
        hideLabel
        id={id}
        label={label}
        labelProps={{ className: "pb-0" }}
        {...rest}
      >
        {({ inputProps }) => (
          <Switch
            checked={value}
            hideLabel={hideLabel}
            id={id}
            key={id}
            label={newLabel}
            name={id}
            onCheckedChange={onChange}
            ref={ref}
            variant={variant}
            {...inputProps}
          />
        )}
      </InputAccessibilityWrapper>
    );
  }
);
