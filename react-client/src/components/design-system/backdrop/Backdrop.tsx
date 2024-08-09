import { classNames } from "~/util/styleUtil";

type BackdropProps = {
  isClosing?: boolean;
  isOpen: boolean;
  onClick?: () => void;
}

export const Backdrop = ({ isClosing, isOpen, onClick }: BackdropProps) => {
  if (!isOpen) return null;
  return (
    <div
      className={classNames("absolute inset-0 z-50 backdrop-blur-sm", {
        "animate-fadeIn bg-black/30": !isClosing,
        "animate-fadeOut": isClosing,
      })}
      data-testid="backdrop"
      onClick={onClick}
    />
  );
};
