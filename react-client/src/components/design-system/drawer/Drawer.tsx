import { ReactNode, useEffect, useRef } from "react";
import { Title } from "../text/Title";
import { IconButton } from "../button/IconButton";
import { classNames } from "~/util/styleUtil";
import { Backdrop } from "../backdrop/Backdrop";

interface DrawerProps {
  children: ReactNode;
  openingButtonId: string;
  title: string;
  onClose: () => void;
  isOpen: boolean;
}

export const Drawer = ({
  children,
  openingButtonId,
  title,
  onClose,
  isOpen,
}: DrawerProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      const openingButton = document.getElementById(openingButtonId);
      openingButton?.focus();
    }
  }, [isOpen, openingButtonId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div aria-hidden={!isOpen} data-testid="drawer-container">
      <Backdrop isOn={isOpen}>
        <div
          className="fixed inset-0 flex items-end lg:items-stretch lg:justify-end"
          onClick={onClose}
        >
          <div
            className={classNames(
              "max-h-90vh w-full rounded-t-2xl border border-border-secondary bg-neutral-white p-xlarge duration-300 ease-in-out lg:max-h-screen lg:w-[336px] lg:rounded-none",
              {
                "animate-slideInFromBottom lg:animate-slideInFromRight": isOpen,
                "animate-slideOutToBottom lg:animate-slideOutToRight": !isOpen,
              }
            )}
            role="dialog"
            aria-labelledby={title}
            aria-modal="true"
            tabIndex={-1}
            onClick={handleClick}
          >
            <div className="mb-small flex items-center justify-between">
              <Title id={title}>{title}</Title>
              <IconButton
                icon="closeXMark"
                label="Close drawer"
                className="text-neutral-600"
                variant="link"
                onClick={onClose}
                ref={closeButtonRef}
              />
            </div>
            <div className="max-h-80vh overflow-y-auto">{children}</div>
          </div>
        </div>
      </Backdrop>
    </div>
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }
};
