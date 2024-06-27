import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { classNames } from "../../util/styleUtil";
import { Icon } from "../icon/Icon";

export type CheckboxProps = {
  asChild?: boolean;
  checked?: boolean | "indeterminate";
  className?: string;
  defaultChecked?: boolean | "indeterminate";
  disabled?: boolean;
  id: string;
  name: string;
  onCheckedChange: () => void;
  required?: boolean;
  value: string;
};

const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <RadixCheckbox.Root
      className={classNames(
        "p-0 flex h-5 w-5 items-center justify-center rounded-md border-solid border-[#6E6D73] bg-white focus:outline-none",
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="absolute flex h-5 w-5 items-center justify-center rounded-md bg-[#C74D3F] text-white">
        <Icon display="check" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
