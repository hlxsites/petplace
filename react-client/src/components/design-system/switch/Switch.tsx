import * as RadixSwitch from "@radix-ui/react-switch";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { CommonInputProps } from "../types/FormTypes";

type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
  "children"
> &
  CommonInputProps;

export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, hideLabel, label, ...props }, ref) => {
  const isChecked = props.checked || props.defaultChecked;
  return (
    <div className="flex items-center gap-xsmall">
      <RadixSwitch.Root
        aria-label={hideLabel ? label : undefined}
        className={classNames(
          "relative h-6 w-[52px] rounded-[21px] border border-solid border-neutral-950 bg-neutral-400 focus:bg-neutral-400 focus:outline-none disabled:border-none",
          {
            "border-none bg-orange-300-contrast focus:bg-orange-300-contrast":
              isChecked,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        <RadixSwitch.Thumb
          className={classNames(
            "transition:transform block h-5 w-[21px] rounded-full bg-white transition-[2000ms]",
            {
              "switch-thumb-checked": isChecked,
              "translate-x-[1px]": !isChecked,
            }
          )}
        />
      </RadixSwitch.Root>
      {!hideLabel && <label htmlFor={props.id}>{label}</label>}
    </div>
  );
});
