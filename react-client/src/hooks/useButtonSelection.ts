import { RefObject, useState } from "react";

export function useButtonSelection() {
  const [selectedElement, setSelectedElement] =
    useState<RefObject<HTMLButtonElement> | null>(null);

  const handleSelect = (ref: RefObject<HTMLButtonElement>) => {
    setSelectedElement(ref);
  };

  const isSelected = (ref: RefObject<HTMLButtonElement>) => {
    return ref === selectedElement;
  };

  return {
    selectedRef: selectedElement,
    handleSelect,
    isSelected,
  };
}
