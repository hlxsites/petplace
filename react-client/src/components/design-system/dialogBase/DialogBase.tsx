import FocusTrap from "focus-trap-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCloseWithAnimation } from "~/hooks/useCloseWithAnimation";
import { classNames } from "~/util/styleUtil";
import { Backdrop } from "../backdrop/Backdrop";
import { IconButton } from "../button/IconButton";
import { Icon } from "../icon/Icon";
import { Title } from "../text/Title";
import { DialogBaseProps } from "../types/DialogBaseTypes";

export const DialogBase = ({
  align,
  ariaLabel,
  children,
  className,
  element,
  icon,
  iconProps,
  id,
  isOpen,
  titleLevel,
  onClose,
  padding = "p-xlarge",
  title,
  width,
}: DialogBaseProps) => {
  const { isClosing, onCloseWithAnimation } = useCloseWithAnimation({
    onClose,
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "visible";
    document.body.style.position = isOpen ? "relative" : "static";
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

  if (!isOpen) return null;

  const hasTitle = !!title;
  const titleId = hasTitle ? `${id}-title` : undefined;

  const renderChildren = (() => {
    if (typeof children === "function") {
      return children({ onCloseWithAnimation: onCloseWithAnimation });
    }
    return children;
  })();

  const portalContent = (
    <>
      <Backdrop isClosing={isClosing} isOpen onClick={onCloseWithAnimation} />
      <FocusTrap
        // TODO: disabled by a debt tech problem, see our documentation
        active={false}
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
          style={{ width }}
          tabIndex={-1}
        >
          {!!icon && <Icon display={icon} {...iconProps} />}
          {title && (
            <div className="mb-small">
              <Title id={titleId} level={titleLevel}>
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

          <div className="h-90vh grid overflow-auto">{renderChildren}</div>
        </div>
      </FocusTrap>
    </>
  );

  return createPortal(portalContent, document.body);
};
