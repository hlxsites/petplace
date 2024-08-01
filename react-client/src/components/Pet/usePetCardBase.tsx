import { classNames } from "~/util/styleUtil";

export type UsePetCardBase = {
  variant?: "sm" | "md" | "lg";
};

function usePetCardBase({ variant = "sm" }: UsePetCardBase) {
  const className = classNames("relative flex w-full", {
    "h-[191px] lg:h-[246px]": variant === "sm",
    "h-[246px] lg:max-h-[306px]": variant === "md",
    "h-[240px]  lg:h-[343px] lg:max-w-[368px]": variant === "lg",
  });

  return { className };
}

export default usePetCardBase;
