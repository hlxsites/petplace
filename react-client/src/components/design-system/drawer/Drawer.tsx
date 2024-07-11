import { ReactNode } from "react";
import { Title } from "../text/Title";
import { IconButton } from "../button/IconButton";
import { classNames } from "~/util/styleUtil";
import Backdrop from "../backdrop/Backdrop";

interface DrawerProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
  isOpen: boolean;
}

export const Drawer = ({ children, title, onClose, isOpen }: DrawerProps) => {
  return (
    <Backdrop isOn={isOpen} turnOff={onClose}>
      <div
        className={classNames(
          "w-full rounded-t-2xl border border-border-secondary bg-neutral-white p-xlarge ease-in-out lg:h-screen lg:w-[336px] lg:rounded-none",
          {
            inactive: !isOpen,
          }
        )}
        data-testid="drawer"
        onClick={handleClick}
      >
        <div className="mb-small flex items-center justify-between">
          <Title>{title}</Title>
          <IconButton
            icon="closeXMark"
            label="Close drawer"
            className="text-neutral-600"
            variant="link"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </Backdrop>
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }
};
