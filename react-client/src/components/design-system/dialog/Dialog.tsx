import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

export const Dialog = (props: DialogCommonProps) => {
  return (
    <DialogBase
      {...props}
      className={{
        closeButton: "absolute right-[2px] top-[-41px] text-neutral-white",
        modal:
          "fixed inset-0 z-50 m-auto max-h-max max-w-max rounded-2xl bg-neutral-white p-xlarge ease-out",
      }}
      element="dialog"
    >
      {props.children}
    </DialogBase>
  );
};
