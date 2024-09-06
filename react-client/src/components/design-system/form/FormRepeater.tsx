import { ReactNode, useState } from "react";
import { Button } from "../button/Button";
import { IconKeys } from "../icon/Icon";
import { Text } from "../text/Text";
import { Title } from "../text/Title";
import {
  ElementSection,
  ElementUnion,
  ExtendedFormValues,
  InputValue,
} from "./types/formTypes";

type FormRepeaterProps = {
  defaultItemValues: ExtendedFormValues;
  onChange?: (values: ExtendedFormValues[]) => void;
  renderElement: (element: ElementUnion, index: number) => ReactNode;
  repeaterSchema: ElementSection;
  values: ExtendedFormValues[];
};

type AddRemoveAction = "add" | "remove";

type RepeaterAddRemoveItem = Record<
  AddRemoveAction,
  {
    onClick: () => void;
    icon: IconKeys;
    label: string;
  }
>;

export const FormRepeater = ({
  defaultItemValues,
  onChange,
  renderElement,
  repeaterSchema,
  values,
}: FormRepeaterProps) => {
  const [items, setItems] = useState<ExtendedFormValues[]>(
    values || [defaultItemValues]
  );

  const { repeatingTitle, title, maxRepeat } = repeaterSchema;

  return (
    <div className="grid gap-xlarge">
      <Title level="h3">{title}</Title>
      {items.map((itemValues, index) => (
        <div key={`repeating-${repeaterSchema.id}-${index}`}>
          {!!repeatingTitle && (
            <div className="mb-base">
              <Title level="h4">{`${repeaterSchema.repeatingTitle} ${index + 1}`}</Title>
            </div>
          )}
          <div className="space-y-base">
            {repeaterSchema.children.map((element, elementIndex) =>
              renderRepeatableElement(element, elementIndex, index)
            )}
          </div>
        </div>
      ))}
      <div className="flex w-full justify-end">
        {!maxRepeat ||
          (items.length < maxRepeat
            ? getRepeaterButton("add")
            : getRepeaterButton("remove"))}
      </div>
    </div>
  );

  function getRepeaterButton(action: AddRemoveAction) {
    const { onClick, icon, label } = (
      {
        add: {
          onClick: handleItemAddition,
          icon: "add",
          label: "Add emergency contact",
        },
        remove: {
          onClick: handleItemRemoval,
          icon: "removeCircle",
          label: "Remove emergency contact",
        },
      } satisfies RepeaterAddRemoveItem
    )[action];

    return (
      <Button
        variant="link"
        onClick={onClick}
        iconLeft={icon}
        className="text-orange-300-contrast"
      >
        <Text color="orange-300-contrast" size="16" fontWeight="semibold">
          {label}
        </Text>
      </Button>
    );
  }

  function handleItemAddition() {
    setItems([...items, defaultItemValues]);
  }

  function handleItemRemoval() {
    const lastItem = items.length - 1;
    removeItem(lastItem);
  }

  function removeItem(index: number) {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onChange?.(updatedItems);
  }

  function handleItemChange(
    index: number,
    changedFieldId: string,
    newValue: InputValue
  ) {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [changedFieldId]: newValue } : item
    );
    setItems(updatedItems);
    onChange?.(updatedItems);
  }

  function renderRepeatableElement(
    element: ElementUnion,
    elementIndex: number,
    repeaterIndex: number
  ): ReactNode {
    if (
      (element.elementType === "row" || element.elementType === "section") &&
      element.children.length
    ) {
      const rowWithProcessedChildren: ElementUnion = {
        ...element,
        children: element.children.map((childElement) =>
          processRepeatableInput(childElement, repeaterIndex)
        ),
      };

      return renderElement(rowWithProcessedChildren, elementIndex);
    } else if ("id" in element && typeof element.id === "string") {
      return renderElement(
        processRepeatableInput(element, repeaterIndex),
        elementIndex
      );

    } else {
      return renderElement(element, elementIndex);
    }
  }

  function processRepeatableInput(element: ElementUnion, index: number) {
    if ("id" in element && typeof element.id === "string") {
      const { id } = element;
      const repeaterFieldId = `${id}-${index}`;
      return {
        ...element,
        id: repeaterFieldId,
        name: repeaterFieldId,
        onChange: (newValue: InputValue) =>
          handleItemChange(index, id, newValue),
      };
    }

    return element;
  }
};
