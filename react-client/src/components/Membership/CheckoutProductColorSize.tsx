import { classNames } from "~/util/styleUtil";
import { Button, Text } from "../design-system";
import { useButtonSelection } from "~/hooks/useButtonSelection";
import { useRef, createRef } from "react";
import { Colors, Sizes } from "~/mocks/MockRestApiServer";

type CheckoutProductColorSizeProps = {
  productColors?: Colors[];
  productSizes?: Sizes[];
};

export const CheckoutProductColorSize = ({
  productColors,
  productSizes,
}: CheckoutProductColorSizeProps) => {
  const { handleSelect: handleColorSelect, isSelected: isColorSelected } =
    useButtonSelection();

  const { handleSelect: handleSizeSelect, isSelected: isSizeSelected } =
    useButtonSelection();

  const colorRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    productColors?.map(() => createRef()) || []
  );

  const sizeRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    productSizes?.map(() => createRef()) || []
  );

  return (
    <div className="flex h-fit w-full gap-large">
      {productColors && (
        <div className="grid gap-small">
          <Text>Color choice:</Text>
          <div className="flex gap-xsmall">
            {productColors.map((productColor, index) => (
              <Button
                aria-label={`color: ${productColor}`}
                className={classNames(
                  "h-[30px] w-[30px] border-2 border-solid !px-0 lg:!px-0",
                  {
                    "border-orange-300-main": isColorSelected(
                      colorRefs.current[index]
                    ),
                    "bg-black hover:!bg-black focus:bg-black":
                      productColor === "black",
                  }
                )}
                key={productColor}
                onClick={() => handleColorSelect(colorRefs.current[index])}
                ref={colorRefs.current[index]}
              />
            ))}
          </div>
        </div>
      )}
      {productSizes && (
        <div className="grid gap-small">
          <Text>Select a size:</Text>
          <div className="flex h-[30px] gap-medium">
            {productSizes.map((productSize, index) => (
              <Button
                className={classNames({
                  "border-2 border-orange-300-contrast text-orange-300-contrast":
                    isSizeSelected(sizeRefs.current[index]),
                })}
                key={productSize}
                onClick={() => handleSizeSelect(sizeRefs.current[index])}
                variant="secondary"
                ref={sizeRefs.current[index]}
              >
                {productSize}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
