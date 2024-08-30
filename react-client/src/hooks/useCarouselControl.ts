import { useCallback, useEffect, useState } from "react";

export const useCarouselControl = (itemsLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsLength);
  }, [itemsLength]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? itemsLength - 1 : prevIndex - 1
    );
  }, [itemsLength]);

  // Keyboard navigation functionality - enhance accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key === "ArrowRight" || event.key === " ") {
        goToNextSlide();
      } else if (event.key === "ArrowLeft" || event.key === "Backspace") {
        goToPrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide]);

  return { currentIndex, goToNextSlide, goToPrevSlide };
};
