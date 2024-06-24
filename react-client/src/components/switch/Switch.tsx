import classNames from "classnames";
import * as RadixSwitch from "@radix-ui/react-switch";
import "./styles.css";

type SwitchProps = {
  asChild?: boolean;
  checked: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
  onCheckedChange: () => void;
  required?: boolean;
  value: string;
};

const Switch = ({ className, label, ...props }: SwitchProps) => (
  <div className="space-between items-center flex-row">
    <RadixSwitch.Root
      className={classNames("SwitchRoot", className)}
      {...props}
    >
      <RadixSwitch.Thumb className="SwitchThumb" />
    </RadixSwitch.Root>
    <p>{label}</p>
  </div>
);

export default Switch;
