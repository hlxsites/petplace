import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface BackdropProps {
  children?: ReactNode;
  isOn: boolean;
  turnOff?: () => void;
}

export const Backdrop = ({ children, isOn, turnOff }: BackdropProps) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOn) {
      setIsRendered(true);
    } else if (isRendered) {
      timeoutId = setTimeout(() => {
        setIsRendered(false);
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOn, isRendered]);

  const portalContent = (
    <div
      className="fixed inset-0 overflow-hidden"
      onClick={turnOff}
      data-testid="backdrop"
    >
      <div
        className={`fixed inset-0 h-screen w-screen backdrop-blur-sm ${
          isOn ? "animate-fadeIn bg-black/30" : "animate-fadeOut"
        }`}
        data-testid="backdrop-blur"
      />
      {children}
    </div>
  );

  if (isRendered) {
    return createPortal(portalContent, document.body);
  }

  return null;
};
