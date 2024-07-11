import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

interface BackdropProps {
  children: ReactNode;
  isOn: boolean;
  turnOff?: () => void;
}

const Backdrop = ({ children, isOn, turnOff }: BackdropProps) => {
  return (
    <div
      className={classNames(
        "fade-in-element absolute right-0 top-0 flex h-screen items-end justify-center overflow-hidden backdrop-blur-sm lg:justify-end",
        {
          "fade-unfaded w-full": isOn,
        }
      )}
      onClick={() => (turnOff ? turnOff() : () => {})}
    >
      {children}
    </div>
  );
};

export default Backdrop;
