import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";
import { ImageCarouselButton } from "./ImageCarouselButton";
import { useCarouselControl } from "~/hooks/useCarouselControl";

type ImageCarouselProps = {
  ariaLabel: string;
  items: ImageItem[];
};

type ImageItem = {
  src: string;
  alt?: string;
};

export const ImageCarousel = ({ ariaLabel, items }: ImageCarouselProps) => {
  const { currentIndex, goToNextSlide, goToPrevSlide } = useCarouselControl(
    items.length
  );

  return (
    <div
      aria-label={ariaLabel}
      className="relative grid w-full place-items-center"
    >
      <div className="relative w-full max-w-3xl overflow-hidden">
        <div
          className="flex h-[265px] transition-transform duration-300 ease-out"
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
