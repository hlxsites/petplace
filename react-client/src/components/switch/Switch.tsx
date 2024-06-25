import * as RadixSwitch from "@radix-ui/react-switch";
import { useState } from "react";
import { classNames } from "../../util/util";

type SwitchProps = {
  asChild?: boolean;
  checked: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
  onCheckedChange: (checkState: boolean) => void;
  required?: boolean;
  value: string;
};

const Switch = ({
  className,
  label,
  checked,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckedChange = (checkedState: boolean) => {
    if (onCheckedChange) {
      onCheckedChange(checkedState);
    }
    setIsChecked(checkedState);
  };

  return (
    <div className="space-between flex-row items-center">
      <RadixSwitch.Root
        className={classNames(
          `relative h-6 w-[52px] rounded-[21px] border-[1px] border-solid border-neutral-950 bg-neutral-400 focus:bg-neutral-400 focus:outline-none disabled:border-none ${isChecked ? "border-none bg-orange-300-contrast focus:bg-orange-300-contrast" : ""}`,
          className
        )}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <RadixSwitch.Thumb
          className={`transition:transform block h-5 w-[21px] rounded-full bg-white transition-[2000ms] ${
            isChecked ? "switch-thumb-checked" : "translate-x-[1px]"
          }`}
        />
      </RadixSwitch.Root>
      <p>{label}</p>
    </div>
  );
};
export default Switch;
