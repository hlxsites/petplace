import { ReactNode } from "react";
import { createNumericArray } from "~/util/misc";
import { Button } from "../button/Button";
import { IconKeys } from "../icon/Icon";
import { Text } from "../text/Text";
import { ElementRepeater, ElementUnion, FormValues } from "./types/formTypes";

type FormRepeaterProps = ElementRepeater & {
  onChange: (values: FormValues[]) => void;
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
  renderElement,
  values,
}: FormRepeaterProps) => {
  const repeaterValues: FormValues[] = (() => {
    if (values[id] && Array.isArray(values[id])) {
      return values[id] as FormValues[];
    }
    if (minRepeat) return createNumericArray(minRepeat).map(() => ({}));
    return [];
  })();

  const renderRepeaterButton = (type: "add" | "remove", index: number) => {
    const handleOnClick = () => {
      if (type === "add") {
        onChange([...repeaterValues, {}]);
      } else {
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
          <div className="space-y-base" key={index}>
            {children.map((element, elementIndex) => {
              const repeaterMetadata = {
                index,
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