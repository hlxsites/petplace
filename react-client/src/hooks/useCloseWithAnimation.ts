import { useState } from "react";

type UseCloseWithAnimationProps = {
  onClose: () => void;
};

export const useCloseWithAnimation = ({
  onClose,
}: UseCloseWithAnimationProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const onCloseWithAnimation = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return {
    isClosing,
    onCloseWithAnimation,
  };
};
