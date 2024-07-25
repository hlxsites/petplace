import { classNames } from "~/util/styleUtil";
import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

type DialogProps = DialogCommonProps & {
  fullWidth?: boolean;
};

export const Dialog = ({ children, fullWidth, ...rest }: DialogProps) => {
  return (
    <DialogBase
      {...rest}
      className={{
        closeButton: "absolute right-[2px] top-[-41px] text-neutral-white",
        modal: classNames(
          "fixed inset-0 z-50 m-auto max-h-max max-w-max rounded-2xl bg-neutral-white p-xlarge ease-out md:w-1/2 md:max-w-[50%]",
          {
            ["md:w-full md:max-w-full"]: fullWidth,
          }
        ),
      }}
      element="dialog"
    >
      {children}
    </DialogBase>
  );
};
