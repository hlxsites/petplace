import { classNames } from "../../util/util";
import { IconProps } from "../icon/Icon";

export interface IUseButtonBase {
  isFullWidth?: boolean;
  isLoading?: boolean;
  iconLeft?: IconProps;
  iconRight?: IconProps;
  variant?: "primary" | "secondary" | "ghost" | "error";
}

function useButtonBase({
  isFullWidth,
  isLoading,
  variant = "primary",
}: IUseButtonBase) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isError = variant === "error";

  const className = classNames(
    "rounded-full min-w-[175px] h-[48px] py-3.5 px-large outline outline-transparent focus:outline-orange-300-contrast outline-2 outline-offset-2",
    {
      "bg-orange-300-contrast text-white hover:bg-orange-500": isPrimary,
      "bg-white border-1 border-neutral-700 text-neutral-700": isSecondary,
      "bg-neutral-100 text-neutral-500": isGhost,
      "bg-red-300 text-white": isError,
      "w-full": isFullWidth,
      loading: isLoading,
    }
  );

  return { className };
}

export default useButtonBase;
