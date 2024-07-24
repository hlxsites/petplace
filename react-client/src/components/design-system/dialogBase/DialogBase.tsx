import FocusTrap from "focus-trap-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCloseWithAnimation } from "~/hooks/useCloseWithAnimation";
import { classNames } from "~/util/styleUtil";
import { Backdrop } from "../backdrop/Backdrop";
import { IconButton } from "../button/IconButton";
import { Title } from "../text/Title";
import { DialogBaseProps } from "../types/DialogBaseTypes";

export const DialogBase = ({
  ariaLabel,
  children,
  className,
  element,
  id,
  isOpen,
  onClose,
  title,
}: DialogBaseProps) => {
  const { isClosing, onCloseWithAnimation } = useCloseWithAnimation({
    onClose,
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isClosing && isOpen && event.key === "Escape") {
        onCloseWithAnimation();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClosing, isOpen, onCloseWithAnimation]);

  if (!isOpen) return null;

  const hasTitle = !!title;
  const titleId = hasTitle ? `${id}-title` : undefined;

  const portalContent = (
    <>
      <Backdrop isClosing={isClosing} isOpen onClick={onCloseWithAnimation} />
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: true,
        }}
      >
        <div
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          aria-modal="true"
          className={classNames(
            className?.modal,
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
          tabIndex={-1}
        >
          <div
            className={classNames("mb-small flex items-center", {
              "justify-end": !hasTitle,
              "justify-between": hasTitle,
            })}
          >
            {title && <Title id={titleId}>{title}</Title>}
            <IconButton
              className={className?.closeButton}
              icon="closeXMark"
              iconProps={{ size: 14 }}
              label={`Close ${element}`}
              onClick={onCloseWithAnimation}
              variant="link"
            />
          </div>
          <div className="max-h-full overflow-y-auto">{children}</div>
        </div>
      </FocusTrap>
    </>
  );

  return createPortal(portalContent, document.body);
};
