const INPUT_ROOT_CLASSNAMES =
  "h-12 flex items-center w-full focus-within:border-brand-main w-full rounded-lg border border-solid bg-neutral-white focus-within:border-2 overflow-hidden";

const INPUT_ERROR_COLOR = "text-text-danger-default";

export const FORM_STYLES = {
  inputRoot: INPUT_ROOT_CLASSNAMES,
  input:
    "h-full w-full bg-neutral-white p-base outline-none placeholder:text-text-hinted disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled",
  inputError: INPUT_ERROR_COLOR,
};
