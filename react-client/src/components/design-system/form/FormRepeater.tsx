import { ReactNode, useEffect, useState } from "react";
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
  const [repeatersValues, setRepeatersValues] = useState<FormValues[]>([]);

  useEffect(() => {
    if (Array.isArray(values[id]))
      return setRepeatersValues(values[id] as FormValues[]);

    let minRepeaters: FormValues[] = [];
    if (minRepeat) {
      minRepeaters = createNumericArray(minRepeat).map(() => ({}));
    }

    onChange(minRepeaters);
    setRepeatersValues(minRepeaters);
  }, [id, minRepeat, onChange, values]);

  const renderRepeaterButton = (type: "add" | "remove", index: number) => {
    const handleOnClick = () => {
      if (type === "add") {
        onChange([...repeatersValues, {}]);
      } else {
        const newValue = repeatersValues.filter((_, i) => i !== index);
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
      {repeatersValues.map((_, index) => {
        const isLastIndex = index === repeatersValues.length - 1;

        const addButton = (() => {
          if (!isLastIndex) return null;
          if (maxRepeat && repeatersValues.length >= maxRepeat) return null;

          return renderRepeaterButton("add", index);
        })();

        const removeButton = (() => {
          if (!isLastIndex) return null;
          if (repeatersValues.length <= minRepeat) return null;

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
