import { classNames } from "~/util/styleUtil";
import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

type DrawerProps = DialogCommonProps & {
  align?: "center" | "right";
  hideCloseButton?: boolean;
};

export const Drawer = ({ align, hideCloseButton, ...props }: DrawerProps) => {
  return (
    <DialogBase
      {...props}
      className={{
        closeButton: classNames(
          "absolute right-[28px] top-[34px] text-neutral-600",
          {
            hidden: hideCloseButton,
          }
        ),
        modal: classNames(
          "fixed bottom-0 left-0 right-0 z-50 max-h-90vh w-full rounded-t-2xl bg-neutral-white p-xlarge duration-300 ease-in-out lg:left-auto lg:top-0 lg:max-h-screen lg:w-[336px] lg:rounded-none",
          {
            "text-center": align === "center",
            "text-right": align === "right",
          }
        ),
      }}
      element="drawer"
    >
      {props.children}
    </DialogBase>
  );
};
