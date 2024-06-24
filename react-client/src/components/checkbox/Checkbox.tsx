import classNames from "classnames";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import "./styles.css";

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

const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <RadixCheckbox.Root
    className={classNames("CheckboxRoot", className)}
    {...props}
  >
    <RadixCheckbox.Indicator className="CheckboxIndicator">
      <CheckSvg />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
);

const CheckSvg = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Checkbox">
        <rect id="Rectangle 2" width="20" height="20" rx="6" fill="#C74D2F" />
        <g id="Check">
          <path
            id="Vector"
            d="M14.6875 5.31213L8.39917 14.2951C8.3162 14.4143 8.20609 14.5121 8.07791 14.5804C7.94973 14.6487 7.80715 14.6856 7.66192 14.688C7.51669 14.6904 7.37297 14.6582 7.2426 14.5942C7.11223 14.5302 6.99895 14.436 6.91208 14.3196L5.3125 12.1871"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};

export default Checkbox;
