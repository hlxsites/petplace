import { forwardRef } from "react";
import { Switch } from "../switch/Switch";
import { Text } from "../text/Text";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputSwitch,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";

type InputSwitchProps = InputWithoutFormBuilderProps<ElementInputSwitch> & {
  label: string;
};

export const InputSwitch = forwardRef<HTMLButtonElement, InputSwitchProps>(
  ({ id, onChange, value, variant, ...rest }, ref) => {
    const conditionalLabel = value ? "On" : "Off";
    // TODO: rever porque o label não vem no ...rest
    return (
      <InputAccessibilityWrapper
        id={id}
        {...rest}
        labelProps={{ className: "pb-0" }}
      >
        {({ inputProps }) => (
          <>
            <div className="flex place-items-center gap-medium">
              <Text size="16">{conditionalLabel}</Text>
              <Switch
                checked={value}
                id={id}
                key={id}
                label={rest.label}
                hideLabel
                name={id}
                onCheckedChange={onChange}
                ref={ref}
                variant={variant}
                {...inputProps}
              />
            </div>
          </>
        )}
      </InputAccessibilityWrapper>
    );
  }
);
