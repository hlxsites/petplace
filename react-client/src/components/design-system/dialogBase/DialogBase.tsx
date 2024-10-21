import FocusTrap from "focus-trap-react";
import {
  cloneElement,
  isValidElement,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useCloseWithAnimation } from "~/hooks/useCloseWithAnimation";
import { classNames } from "~/util/styleUtil";
import { Backdrop } from "../backdrop/Backdrop";
import { IconButton } from "../button/IconButton";
import { Icon } from "../icon/Icon";
import { Title } from "../text/Title";
import { DialogBaseProps } from "../types/DialogBaseTypes";

// Global counter for z-index
let GLOBAL_Z_INDEX = 1000;

export const DialogBase = ({
  align,
  ariaLabel,
  children,
  className,
  element,
  icon,
  iconProps,
  id,
  isDesktopScreen,
  isOpen,
  isTitleResponsive,
  titleSize,
  onClose,
  padding = "p-xlarge",
  title,
  trigger,
  width,
}: DialogBaseProps) => {
  const { isClosing, onCloseWithAnimation } = useCloseWithAnimation({
    onClose,
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  const zIndexRef = useRef(GLOBAL_Z_INDEX);
  const zIndex = zIndexRef.current;

  useEffect(() => {
    // Increment global z-index by 2 each time the dialog is opened
    if (isOpen) {
      GLOBAL_Z_INDEX += 2;
      zIndexRef.current = GLOBAL_Z_INDEX;
    }
  }, [isOpen]);

  useEffect(() => {
    const bodyStyle = document.body.style;
    const originalOverflow = bodyStyle.overflow;

    if (isOpen) {
      bodyStyle.overflow = "hidden";
    }

    return () => {
      if (isOpen) {
        bodyStyle.overflow = originalOverflow;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isClosing && isOpen && event.key === "Escape") {
        onCloseWithAnimation?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClosing, isOpen, onCloseWithAnimation]);

  const renderTrigger = (() => {
    if (!trigger || !isValidElement(trigger)) return null;

    // @ts-expect-error - We know that trigger is a valid element
    return cloneElement<ReactElement<HTMLButtonElement>>(trigger, {
      "aria-controls": id,
      "aria-haspopup": "dialog",
      "aria-expanded": isOpen,
    });
  })();

  if (!isOpen) return renderTrigger;

  const hasTitle = !!title;
  const titleId = hasTitle ? `${id}-title` : undefined;

  const renderChildren = (() => {
    if (typeof children === "function") {
      return children({ onCloseWithAnimation: onCloseWithAnimation });
    }
    return children;
  })();

  const dialogMaxHeight = isDesktopScreen
    ? "calc(100vh - 00px)"
    : "calc(90vh - 200px)";

  const portalContent = (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: zIndex - 1 }}>
        <Backdrop
          isClosing={isClosing}
          isOpen={true}
          onClick={onCloseWithAnimation}
        />
      </div>
      <FocusTrap
        active={false}
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: true,
        }}
      >
        <div
          ref={dialogRef}
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          aria-modal="true"
          className={classNames(
            "fixed z-50",
            className?.modal,
            padding,
            {
              "text-center": align === "center",
              "text-right": align === "right",
            },
            element === "drawer" && {
              "animate-slideInFromBottom lg:animate-slideInFromRight":
                !isClosing,
              "animate-slideOutToBottom lg:animate-slideOutToRight": isClosing,
            },
            element === "dialog" && {
              "animate-fadeOut": isClosing,
            }
          )}
          id={id}
          role="dialog"
          style={{
            width: width === "auto" ? "auto" : width,
            zIndex: zIndex,
          }}
          tabIndex={-1}
        >
          {!!icon && <Icon display={icon} {...iconProps} />}
          {title && (
            <div className="mb-small">
              <Title
                id={titleId}
                level="h4"
                size={titleSize}
                isResponsive={isTitleResponsive}
              >
                {title}
              </Title>
            </div>
          )}

          {!!onClose && (
            <IconButton
              className={className?.closeButton}
              icon="closeXMark"
              iconProps={{ size: 14 }}
              label={`Close ${element}`}
              onClick={onCloseWithAnimation}
              variant="link"
            />
          )}

          <div
            className="overflow-y-auto"
            style={{ maxHeight: dialogMaxHeight }}
          >
            {renderChildren}
          </div>
        </div>
      </FocusTrap>
    </>
  );

  return (
    <>
      {renderTrigger}
      {createPortal(portalContent, document.body)}
    </>
  );
};
