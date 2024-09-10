import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { classNames } from "~/util/styleUtil";
import {
  ElementInputCheckboxGroup,
  InputWithoutFormBuilderProps,
} from "../form/types/formTypes";
import { Icon } from "../icon/Icon";

type CheckboxGroupType =
  InputWithoutFormBuilderProps<ElementInputCheckboxGroup>;

type CheckboxProps = Omit<
  Omit<ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, "onChange">,
  "children"
> &
  Omit<CheckboxGroupType, "value" | "options" | "onChange">;

export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, hideLabel, label, ...props }, ref) => {
  const labelElement = (() => {
    if (hideLabel) return null;
    return (
      <label className="font-franklin text-sm" htmlFor={props.id}>
        {label}
      </label>
    );
  })();

  return (
    <div className="grid grid-cols-[auto,_1fr] items-center gap-small">
      <RadixCheckbox.Root
        aria-label={hideLabel ? label : undefined}
        className={classNames(
          "flex h-5 w-5 items-center justify-center rounded-md border-solid border-[#6E6D73] bg-white p-0 focus:outline-none",
          className
        )}
        ref={ref}
        {...props}
      >
        <RadixCheckbox.Indicator className="absolute flex h-5 w-5 items-center justify-center rounded-md bg-[#C74D3F] text-white">
          <Icon display="check" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {labelElement}
    </div>
  );
});
