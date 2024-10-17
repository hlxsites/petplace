import { createRef, useRef } from "react";

import { ProductDescription } from "~/domain/models/products/ProductModel";
import { classNames } from "~/util/styleUtil";
import { Button, Text } from "../design-system";

type CheckoutProductColorSizeProps = {
  availableColors: ProductDescription["availableColors"];
  availableSizes: ProductDescription["availableSizes"];
  onChange: (props: { color: string; size: string }) => void;
  selectedColor: string;
  selectedSize: string;
};

export const CheckoutProductColorSize = ({
  availableColors,
  availableSizes,
  onChange,
  selectedColor,
  selectedSize,
}: CheckoutProductColorSizeProps) => {
  const colorRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    availableColors?.map(() => createRef()) || []
  );

  const sizeRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    availableSizes?.map(() => createRef()) || []
  );

  const handleOnChangeColor = (newColor: string) => {
    return () => {
      if (selectedColor === newColor) return; // Do nothing if the color is the same
      onChange({ color: newColor, size: selectedSize });
    };
  };

  const handleOnChangeSize = (newSize: string) => {
    return () => {
      if (selectedSize === newSize) return; // Do nothing if the size is the same
      onChange({ color: selectedColor, size: newSize });
    };
  };

  return (
    <div className="flex h-fit w-full gap-large">
      {!!availableColors?.length && (
        <div className="grid gap-small">
          <Text color="background-color-tertiary" size="14">
            Color choice:
          </Text>
          <div className="flex gap-xsmall">
            {availableColors.map((productColor, index) => {
              const isSelected = productColor === selectedColor;
              const ariaLabelStart = isSelected ? "selected color" : "color";

              return (
                <Button
                  aria-label={`${ariaLabelStart}: ${productColor}`}
                  className={classNames(
                    "h-[30px] w-[30px] border-2 border-solid !px-0 lg:!px-0",
                    {
                      "border-orange-300-main": isSelected,
                      "bg-black hover:!bg-black focus:bg-black":
                        productColor === "black",
                      "border-neutral-500 bg-white hover:!bg-white focus:bg-white":
                        productColor === "white",
                      "border-2 border-solid border-orange-300-main bg-white":
                        productColor === "white" && isSelected,
                    }
                  )}
                  key={`${productColor} - ${index}`}
                  onClick={handleOnChangeColor(productColor)}
                  ref={colorRefs.current[index]}
                />
              );
            })}
          </div>
        </div>
      )}
      {!!availableSizes?.length && (
        <div className="grid gap-small">
          <Text color="background-color-tertiary" size="14">
            Select a size:
          </Text>
          <div className="flex h-[30px] gap-medium">
            {availableSizes.map((productSize, index) => {
              const isSelected = productSize === selectedSize;
              const ariaLabelStart = isSelected ? "selected size" : "size";

              return (
                <Button
                  aria-label={`${ariaLabelStart}: ${productSize}`}
                  className={classNames({
                    "border-2 border-orange-300-contrast text-orange-300-contrast":
                      isSelected,
                  })}
                  key={productSize}
                  onClick={handleOnChangeSize(productSize)}
                  variant="secondary"
                  ref={sizeRefs.current[index]}
                >
                  {productSize}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
