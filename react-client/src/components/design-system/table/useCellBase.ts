import { classNames } from "~/util/styleUtil";

interface CellProps {
  isEven?: boolean;
  isHeader?: boolean;
}

export function useCellBase() {
  const className = ({ isEven, isHeader }: CellProps) =>
    classNames("py-base px-large text-[14px]/[14px]", {
      "bg-white": isEven,
      "bg-neutral-50": !isEven,
      "pt-xlarge": isHeader,
      "text-text-color-supporting": !isHeader,
    });
  return { className };
}
