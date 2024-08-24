import { renderHook, act } from "@testing-library/react";
import { useButtonSelection } from "./useButtonSelection";

describe("useButtonSelection", () => {
  it("should initialize with no selected element", () => {
    const { result } = getRenderer();

    expect(result.current.selectedRef).toBeNull();
  });

  it("should select an element and set it as selectedRef", () => {
    const { result } = getRenderer();
    const mockRef = { current: document.createElement("button") };

    act(() => {
      result.current.handleSelect(mockRef);
    });

    expect(result.current.selectedRef).toBe(mockRef);
  });

  it("should correctly identify the selected element", () => {
    const { result } = getRenderer();
    const mockRef = { current: document.createElement("button") };
    const anotherMockRef = { current: document.createElement("button") };

    act(() => {
      result.current.handleSelect(mockRef);
    });

    expect(result.current.isSelected(mockRef)).toBe(true);
    expect(result.current.isSelected(anotherMockRef)).toBe(false);
  });

  it("should update the selected element when a different one is selected", () => {
    const { result } = getRenderer();
    const firstMockRef = { current: document.createElement("button") };
    const secondMockRef = { current: document.createElement("button") };

    act(() => {
      result.current.handleSelect(firstMockRef);
    });

    expect(result.current.selectedRef).toBe(firstMockRef);
    expect(result.current.isSelected(firstMockRef)).toBe(true);

    act(() => {
      result.current.handleSelect(secondMockRef);
    });

    expect(result.current.selectedRef).toBe(secondMockRef);
    expect(result.current.isSelected(secondMockRef)).toBe(true);
    expect(result.current.isSelected(firstMockRef)).toBe(false);
  });
});

function getRenderer() {
  return renderHook(() => useButtonSelection());
}
