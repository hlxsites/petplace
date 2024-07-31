import { classNames } from "~/util/styleUtil";
import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

type DialogProps = DialogCommonProps & {
  align?: "center" | "right";
  hideCloseButton?: boolean;
  fullWidth?: boolean;
};

export const Dialog = ({
  align,
  children,
  fullWidth,
  hideCloseButton,
  ...rest
}: DialogProps) => {
  return (
    <DialogBase
      {...rest}
      className={{
        closeButton: classNames(
          "absolute right-[2px] top-[-41px] text-neutral-white",
          {
            hidden: hideCloseButton,
          }
        ),
        modal: classNames(
          "fixed inset-0 z-50 m-auto max-h-max max-w-max rounded-2xl bg-neutral-white p-xlarge ease-out md:w-1/2 md:max-w-[50%]",
          {
            "md:w-full md:max-w-full": fullWidth,
            "text-center": align === "center",
            "text-right": align === "right",
          }
        ),
      }}
      element="dialog"
    >
      {children}
    </DialogBase>
  );
};
