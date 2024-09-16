import FocusTrap from "focus-trap-react";
import { cloneElement, isValidElement, ReactElement, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCloseWithAnimation } from "~/hooks/useCloseWithAnimation";
import { classNames, resetBodyStyles } from "~/util/styleUtil";
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

  const headerFooterHeight = title ? 60 : 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "visible";
    document.body.style.position = isOpen ? "relative" : "static";

    // Reset body styles when unmounting
    return resetBodyStyles;
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
            className="h-85dvh grid overflow-auto"
            style={{
              maxHeight: `calc(85dvh - ${headerFooterHeight}px)`,
            }}
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
