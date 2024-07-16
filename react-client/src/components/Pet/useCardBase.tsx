import { classNames } from "~/util/styleUtil";

export type UsePetCardBase = {
  variant?: "sm" | "md" | "lg";
};

function usePetCardBase({ variant = "sm" }: UsePetCardBase) {
  const isSmall = variant === "sm";
  const isRegular = variant === "md";
  const isLarge = variant === "lg";

  const className = classNames("relative flex w-full", {
    "h-[191px] lg:h-[246px]": isSmall,
    "h-[246px] lg:max-h-[306px]": isRegular,
    "h-[240px]  lg:h-[343px] lg:max-w-[368px]": isLarge,
  });

  return { className };
}

export default usePetCardBase;
