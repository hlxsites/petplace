import * as RadixSwitch from "@radix-ui/react-switch";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { classNames } from "~/util/styleUtil";
import { TextSpan } from "../text/TextSpan";
import { CommonInputProps } from "../types/FormTypes";
import { StyleProps } from "../types/TextTypes";

export type SwitchVariant = "orange" | "purple";

type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
  "children"
> &
  CommonInputProps & {
    textProps?: StyleProps;
    variant?: SwitchVariant;
  };

export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(
  (
    { className, hideLabel, label, textProps, variant = "orange", ...props },
    ref
  ) => {
    const isChecked = props.checked || props.defaultChecked;
    const { rootClassName, thumbClassName } = useSwitchVariant(
      isChecked ?? false,
      variant
    );

    return (
      <div className="flex items-center gap-small">
        {!hideLabel && (
          <label htmlFor={props.id}>
            <TextSpan fontFamily="franklin" size="16" {...textProps}>
              {label}
            </TextSpan>
          </label>
        )}
        <RadixSwitch.Root
          aria-label={hideLabel ? label : undefined}
          className={classNames(rootClassName, className)}
          ref={ref}
          {...props}
        >
          <RadixSwitch.Thumb className={thumbClassName} />
        </RadixSwitch.Root>
      </div>
    );
  }
);

function useSwitchVariant(isChecked: boolean, variant: SwitchVariant) {
  const rootClassName = classNames(
    "relative h-7 w-[20px] border-none max-w-[5px] rounded-[21px] bg-neutral-400 focus:bg-neutral-400 focus:outline-none disabled:border-none",
    {
      "hover:bg-purple-300": variant === "purple",
      "border-none bg-orange-300-contrast focus:bg-orange-300-contrast":
        isChecked && variant === "orange",
      "bg-purple-100 focus:bg-purple-100":
        isChecked && variant === "purple",
    }
  );

  const thumbClassName = classNames(
    "transition:transform absolute left-[2px] top-[2px] block h-6 w-[25px] rounded-full bg-white transition-[2000ms]",
    {
      "bg-purple-500 hover:bg-purple-300": isChecked && variant === "purple",
      "top-[2px] translate-x-[30px]": isChecked,
    }
  );

  return { rootClassName, thumbClassName };
}
