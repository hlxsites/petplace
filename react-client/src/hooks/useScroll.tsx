import { useEffect, useRef } from "react";

function scrollToTop(smooth: boolean = false) {
  if (smooth) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    document.documentElement.scrollTop = 0;
  }
}

type UseScrollProps = {
  autoScrollToTop?: boolean;
};

export const useScroll = ({ autoScrollToTop }: UseScrollProps) => {
  const didMount = useRef(false);

  useEffect(() => {
    // Automatically scroll to top on mount
    if (!didMount.current && autoScrollToTop) {
      scrollToTop(false);
      didMount.current = true;
    }
  }, [autoScrollToTop]);

  return {
    scrollToTop,
  };
};
