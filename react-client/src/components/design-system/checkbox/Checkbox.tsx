import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";
import { CommonInputProps } from "../types/FormTypes";

type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
  "children"
> &
  CommonInputProps;

export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, hideLabel, label, ...props }, ref) => {
  return (
    <div className="flex items-center gap-2">
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
      {!hideLabel && <label htmlFor={props.id}>{label}</label>}
    </div>
  );
});
