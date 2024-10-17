import { useWindowWidth } from "~/hooks/useWindowWidth";
import { DialogBase } from "../dialogBase/DialogBase";
import { DialogCommonProps } from "../types/DialogBaseTypes";
import { classNames } from "~/util/styleUtil";

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
        modal: classNames(
          "fixed z-50 bg-neutral-white duration-300 ease-in-out",
          isDesktopScreen
            ? "bottom-0 right-0 top-0 rounded-l-2xl"
            : "bottom-0 left-0 right-0 rounded-t-2xl"
        ),
      }}
      element="drawer"
      width={isDesktopScreen ? width : "100%"}
    >
      {({ onCloseWithAnimation }) => (
        <>
          {typeof children === "function"
            ? children({ onCloseWithAnimation })
            : children}
        </>
      )}
    </DialogBase>
  );
};
