import { act, renderHook } from "@testing-library/react";
import { useWindowWidth } from "./useWindowWidth";

describe("useWindowWidth", () => {
  it("should initialize with the correct window width", () => {
    const mockWindowWidth = 800;
    window.innerWidth = mockWindowWidth;

    const { result } = getRenderer();

    expect(result.current).toBe(mockWindowWidth);
  });

  it("should update window width on resize", () => {
    const newWindowWidth = 1024;
    const previousWindowWidth = 800;

    window.innerWidth = previousWindowWidth;

    const { result } = getRenderer();
    expect(result.current).toBe(previousWindowWidth);

    // Resize to a new width
    act(() => {
      window.innerWidth = newWindowWidth;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(newWindowWidth);
  });

  it("should add and remove event listeners", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    renderHook(() => useWindowWidth());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    // Cleanup
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

function getRenderer() {
  return renderHook(() => useWindowWidth());
}
