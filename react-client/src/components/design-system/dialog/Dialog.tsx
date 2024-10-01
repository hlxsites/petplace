import { useWindowWidth } from "~/hooks/useWindowWidth";
import { classNames } from "~/util/styleUtil";
import { DialogBase } from "../dialogBase/DialogBase";
import { Drawer } from "../drawer/Drawer";
import { DialogCommonProps } from "../types/DialogBaseTypes";

type DialogProps = DialogCommonProps & {
  fullWidth?: boolean;
};

export const Dialog = ({ children, fullWidth, ...rest }: DialogProps) => {
  const windowWidth = useWindowWidth();

  // Always use Drawer on mobile screens
  if (windowWidth < 768) {
    return <Drawer {...rest}>{children}</Drawer>;
  }

  return (
    <DialogBase
      {...rest}
      className={{
        closeButton: "absolute right-[2px] top-[-41px] text-neutral-white",
        modal: classNames(
          "fixed inset-0 z-50 m-auto max-h-fit max-w-max rounded-2xl bg-neutral-white ease-out",
          {
            "md:w-full md:max-w-full": fullWidth,
          }
        ),
      }}
      element="dialog"
    >
      {children}
    </DialogBase>
  );
};
