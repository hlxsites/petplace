import FocusTrap from "focus-trap-react";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCloseWithAnimation } from "~/hooks/useCloseWithAnimation";
import { classNames } from "~/util/styleUtil";
import { Backdrop } from "../backdrop/Backdrop";
import { IconButton } from "../button/IconButton";
import { Title } from "../text/Title";

type TitleProps =
  | {
      ariaLabel?: undefined;
      title: string;
    }
  | {
      ariaLabel: string;
      title?: undefined;
    };

type DrawerProps = TitleProps & {
  children: ReactNode;
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export const Drawer = ({
  ariaLabel,
  children,
  id,
  isOpen,
  onClose,
  title,
}: DrawerProps) => {
  const { isClosing, onCloseWithAnimation } = useCloseWithAnimation({
    onClose,
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasTitle = !!title;
  const titleId = hasTitle ? `${id}-title` : undefined;

  const portalContent = (
    <FocusTrap>
      <div>
        <Backdrop
          isClosing={isClosing}
          isOpen={isOpen}
          onClick={onCloseWithAnimation}
        />
        <div
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          aria-modal="true"
          className={classNames(
            "max-h-90vh fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-2xl bg-neutral-white p-xlarge duration-300 ease-in-out lg:left-auto lg:top-0 lg:max-h-screen lg:w-[336px] lg:rounded-none",
            {
              "animate-slideInFromBottom lg:animate-slideInFromRight":
                !isClosing,
              "animate-slideOutToBottom lg:animate-slideOutToRight": isClosing,
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
              className="text-neutral-600"
              icon="closeXMark"
              iconProps={{ size: 14 }}
              label="Close drawer"
              onClick={onCloseWithAnimation}
              variant="link"
            />
          </div>
          <div className="max-h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </FocusTrap>
  );

  return createPortal(portalContent, document.body);
};
