import { ReactNode, useEffect, useState } from "react";
import { classNames } from "~/util/styleUtil";
import { IconButton } from "../button/IconButton";
import { Icon } from "../icon/Icon";

type CarouselProps = {
  ariaLabel: string;
  items: ReactNode[];
};

export const Carousel = ({ ariaLabel, items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

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

  return (
    <div
      aria-label={ariaLabel}
      className="relative grid w-full place-items-center"
      tabIndex={0}
    >
      <div className="flex items-center">
        <IconButton
          icon="chevronLeft"
          iconProps={{
            className: "text-orange-300-contrast",
            size: 16,
          }}
          label="Previous Slide"
          onClick={goToPrevSlide}
          variant="link"
        />

        <div className="mt-4 flex gap-xsmall">
          {items.map((_, index) => (
            <Icon
              className={classNames("text-white", {
                "text-neutral-500": index === currentIndex,
              })}
              display="ellipseWithStroke"
              key={`carousel-indicator-${index}`}
              size={16}
            />
          ))}
        </div>

        <IconButton
          icon="chevronRight"
          iconProps={{
            className: "text-orange-300-contrast",
            size: 16,
          }}
          label="Next Slide"
          onClick={goToNextSlide}
          variant="link"
        />
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden">
        <div
          className="flex gap-xsmall transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 82}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={`carousel-item-${index}`}
              className="w-[87%] flex-shrink-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
