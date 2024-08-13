import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

export const Drawer = ({ children, ...rest }: DialogCommonProps) => {
  return (
    <DialogBase
      {...rest}
      className={{
        closeButton: "absolute right-[28px] top-[34px] text-neutral-600",
        modal:
          "fixed bottom-0 left-0 right-0 z-50 max-h-90vh w-full rounded-t-2xl bg-neutral-white p-xlarge duration-300 ease-in-out lg:left-auto lg:top-0 lg:max-h-screen lg:w-[336px] lg:rounded-none",
      }}
      element="drawer"
    >
      {children}
    </DialogBase>
  );
};
