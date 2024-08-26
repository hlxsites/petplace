import { useCallback, useEffect, useState } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";
import { ImageCarouselButton } from "./ImageCarouselButton";

type ImageCarouselProps = {
  ariaLabel: string;
  items: ImageItem[];
};

type ImageItem = {
  src: string;
  alt?: string;
};

export const ImageCarousel = ({ ariaLabel, items }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }, [items.length]);

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide]);

  return (
    <div
      aria-label={ariaLabel}
      className="relative grid w-full place-items-center"
    >
      <div className="relative w-full max-w-3xl overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out h-[265px]"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map(({ src, alt }, index) => (
            <div
              key={`image-item-${index}`}
              className="flex w-full flex-shrink-0 justify-center bg-white"
            >
              <img src={src} alt={alt} className="object-contain" />
            </div>
          ))}
        </div>

        <div className="px-4 absolute top-0 flex h-full w-full items-center justify-between p-small">
          <ImageCarouselButton
            type="previous"
            disabled={currentIndex === 0}
            onClick={goToPrevSlide}
          />

          <ImageCarouselButton
            type="next"
            disabled={currentIndex === items.length - 1}
            onClick={goToNextSlide}
          />
        </div>

        <div className="absolute bottom-2 flex w-full justify-center gap-xsmall">
          {items.map((_, index) => (
            <Icon
              className={classNames("text-white", {
                "text-neutral-500": index === currentIndex,
              })}
              display="ellipseWithStroke"
              key={`image-indicator-${index}`}
              size={16}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
