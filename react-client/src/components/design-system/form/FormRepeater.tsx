import { ReactNode } from "react";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { createNumericArray } from "~/util/misc";
import { Button } from "../button/Button";
import { IconKeys } from "../icon/Icon";
import { Text } from "../text/Text";
import { ElementRepeater, ElementUnion, FormValues } from "./types/formTypes";

type FormRepeaterProps = ElementRepeater & {
  onChange: (values: FormValues[]) => void;
  onDelete?: (index: FormValues) => void;
  renderElement: (element: ElementUnion, index: number) => ReactNode;
  values: FormValues;
};

export const FormRepeater = ({
  children,
  id,
  labels,
  maxRepeat,
  minRepeat = 0,
  onChange,
  onDelete,
  renderElement,
  values,
}: FormRepeaterProps) => {
  const repeaterValues = (() => {
    if (values[id] && Array.isArray(values[id])) {
      // We know form repeater values are always an array of FormValues objects
      return values[id] as FormValues[];
    }
    return null;
  })();

  useDeepCompareEffect(() => {
    const quantity = repeaterValues?.length || 0;
    if (quantity < minRepeat) {
      onChange(createNumericArray(minRepeat).map(() => ({})));
    } else if (!repeaterValues) {
      onChange([{}]);
    }
  }, [minRepeat, onChange, repeaterValues]);

  if (!repeaterValues) return null;

  const renderRepeaterButton = (type: "add" | "remove", index: number) => {
    const handleOnClick = () => {
      if (type === "add") {
        onChange([...repeaterValues, {}]);
      } else {
        onDelete?.(repeaterValues[index]);
        const newValue = repeaterValues.filter((_, i) => i !== index);
        onChange(newValue);
      }
    };

    const icon: IconKeys = (() => {
      if (type === "add") return "add";
      return "removeCircle";
    })();

    const label = (() => {
      if (labels) return labels[type];
      if (type === "add") return "Add";
      return "Remove";
    })();

    return (
      <Button
        variant="link"
        onClick={handleOnClick}
        iconLeft={icon}
        className="text-orange-300-contrast"
      >
        <Text color="orange-300-contrast" size="16" fontWeight="semibold">
          {label}
        </Text>
      </Button>
    );
  };

  return (
    <div className="grid gap-xlarge">
      {repeaterValues.map((_, index) => {
        const isLastIndex = index === repeaterValues.length - 1;

        const addButton = (() => {
          if (!isLastIndex) return null;
          if (maxRepeat && repeaterValues.length >= maxRepeat) return null;

          return renderRepeaterButton("add", index);
        })();

        const removeButton = (() => {
          if (!isLastIndex) return null;
          if (repeaterValues.length <= minRepeat) return null;

          return renderRepeaterButton("remove", index);
        })();

        const buttonsContainer = (() => {
          if (!addButton && !removeButton) return null;
          return (
            <div className="flex w-full flex-col items-end">
              {removeButton}
              {addButton}
            </div>
          );
        })();

        return (
          <div className="space-y-base" key={`repeater-${id}-${index}`}>
            {children.map((element, elementIndex) => {
              const repeaterMetadata = {
                index,
                repeaterId: id,
              };

              return renderElement(
                { ...element, repeaterMetadata },
                elementIndex
              );
            })}
            {buttonsContainer}
          </div>
        );
      })}
    </div>
  );
};
