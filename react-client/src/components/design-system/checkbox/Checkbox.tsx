import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { classNames } from "~/util/styleUtil";
import {
  ElementInputCheckboxGroup,
  InputWithoutFormBuilderProps,
} from "../form/types/formTypes";
import { Icon } from "../icon/Icon";
import { TextSpan } from "../text/TextSpan";
import { StyleProps } from "../types/TextTypes";

type CheckboxVariant = "orange" | "purple";

type CheckboxGroupType =
  InputWithoutFormBuilderProps<ElementInputCheckboxGroup>;

type CheckboxProps = Omit<
  Omit<ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, "onChange">,
  "children"
> &
  Omit<CheckboxGroupType, "value" | "options" | "onChange"> & {
    textProps?: StyleProps;
    variant?: CheckboxVariant;
  };

export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(
  (
    { className, hideLabel, label, textProps, variant = "orange", ...props },
    ref
  ) => {
    const { indicatorClassName, rootClassName } = useCheckboxVariant(variant);
    const labelElement = (() => {
      if (hideLabel) return null;
      return (
        <label htmlFor={props.id}>
          <TextSpan fontFamily="franklin" size="16" {...textProps}>
            {label}
          </TextSpan>
        </label>
      );
    })();

    return (
      <div className="grid grid-cols-[auto,_1fr] items-center gap-small">
        <RadixCheckbox.Root
          aria-label={hideLabel ? label : undefined}
          className={classNames(rootClassName, className)}
          ref={ref}
          {...props}
        >
          <RadixCheckbox.Indicator className={indicatorClassName}>
            <Icon display="checkSolo" />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        {labelElement}
      </div>
    );
  }
);

function useCheckboxVariant(variant: CheckboxVariant) {
  const rootClassName = classNames(
    "flex h-5 w-5 items-center justify-center rounded-md border-solid border-neutral-600 bg-white p-0 focus:outline-none",
    { "focus:bg-purple-300 hover:bg-purple-300": variant === "purple" }
  );

  const indicatorClassName = classNames(
    "absolute flex h-5 w-5 items-center justify-center rounded-md text-white",
    {
      "bg-orange-300-contrast": variant === "orange",
      "bg-purple-300": variant === "purple",
    }
  );

  return { indicatorClassName, rootClassName };
}
