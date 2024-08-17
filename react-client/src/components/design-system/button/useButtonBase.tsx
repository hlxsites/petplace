import { classNames } from "~/util/styleUtil";

export type UseButtonBase = {
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "link" | "error";
};

function useButtonBase({
  disabled,
  fullWidth,
  isLoading,
  variant = "primary",
}: UseButtonBase) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isLink = variant === "link";
  const isError = variant === "error";

  const className = classNames(
    "rounded-full border font-semibold focus:outline-none items-center flex justify-center px-base py-small lg:px-large text-base lg:py-medium",
    {
      "bg-orange-300-contrast text-white hover:!bg-orange-500 focus:bg-orange-300-contrast":
        isPrimary,
      "bg-white border-neutral-700 text-neutral-700 hover:bg-neutral-100 focus:bg-white":
        isSecondary,
      "px-xsmall py-xsmall hover:bg-transparent hover:border-transparent bg-transparent text-neutral-700 lg:px-small lg:py-small focus:bg-transparent":
        isLink,
      "bg-red-300 text-white": isError,
      "!cursor-not-allowed hover:!bg-inherit": disabled,
      "w-full": fullWidth,
      loading: isLoading,
    }
  );

  return { className };
}

export default useButtonBase;
