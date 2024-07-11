import { classNames } from "~/util/styleUtil";

export type UseButtonBase = {
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "link" | "error";
};

function useButtonBase({
  fullWidth,
  isLoading,
  variant = "primary",
}: UseButtonBase) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isLink = variant === "link";
  const isError = variant === "error";

  const className = classNames(
    "rounded-full border-1 font-semibold outline outline-transparent outline-2 outline-offset-2 items-center flex justify-center px-base py-small lg:px-large text-base lg:py-[12px]",
    {
      "bg-orange-300-contrast text-white hover:bg-orange-500 focus:bg-orange-300-contrast focus:outline-orange-100":
        isPrimary,
      "bg-white border-neutral-700 text-neutral-700 hover:bg-neutral-100 focus:bg-white focus:outline-neutral-100":
        isSecondary,
      "bg-transparent border-0 text-neutral-700": isLink,
      "bg-red-300 text-white": isError,
      "w-full": fullWidth,
      loading: isLoading,
    }
  );

  return { className };
}

export default useButtonBase;
