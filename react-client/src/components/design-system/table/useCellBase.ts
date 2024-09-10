import { classNames } from "~/util/styleUtil";

type CellProps = {
  isEven?: boolean;
  isHeader?: boolean;
}

export function useCellBase() {
  const className = ({ isEven, isHeader }: CellProps) =>
    classNames("py-base px-large text-[14px]/[14px] text-nowrap", {
      "bg-white": isEven,
      "bg-neutral-50": !isEven,
      "pt-xlarge": isHeader,
      "text-text-color-supporting": !isHeader,
    });
  return { className };
}
