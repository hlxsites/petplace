import { useWindowWidth } from "~/hooks/useWindowWidth";
import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";

export const Drawer = ({
  children,
  width = "auto",
  ...rest
}: DialogCommonProps) => {
  const windowWidth = useWindowWidth();

  const isDesktopScreen = windowWidth >= 1024;

  return (
    <DialogBase
      {...rest}
      className={{
        closeButton: "absolute right-[28px] top-[34px] text-neutral-600",
        modal:
          "fixed bottom-0 left-0 right-0 z-50 max-h-90vh w-full overflow-y-auto rounded-t-2xl bg-neutral-white duration-300 ease-in-out lg:left-auto lg:top-0 lg:max-h-screen lg:rounded-none",
      }}
      element="drawer"
      width={isDesktopScreen ? width : "100%"}
    >
      {children}
    </DialogBase>
  );
};
