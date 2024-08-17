import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useDrawerContentState } from "./useDrawerContentState";

describe("useDrawerContentState", () => {
  it("should return isDrawerOpen as true when content matches drawerKey", () => {
    const { result } = getHookRenderer({
      drawerKey: "testDrawer",
      initialEntry: "?content=testDrawer",
    });

    expect(result.current.isDrawerOpen).toBe(true);
  });

  it("should return isDrawerOpen as false when content does not match drawerKey", () => {
    const { result } = getHookRenderer({
      drawerKey: "testDrawer",
      initialEntry: "?content=otherDrawer",
    });

    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("should open drawer when onOpenDrawer is called", () => {
    const { result } = getHookRenderer({
      drawerKey: "testDrawer",
      initialEntry: "",
    });
    expect(result.current.isDrawerOpen).toBe(false);

    act(() => result.current.onOpenDrawer());
    expect(result.current.isDrawerOpen).toBe(true);
  });

  it("should close drawer when onCloseDrawer is called", () => {
    const { result } = getHookRenderer({
      drawerKey: "drawerOne",
      initialEntry: "?content=drawerOne",
    });
    expect(result.current.isDrawerOpen).toBe(true);

    act(() => result.current.onCloseDrawer());
    expect(result.current.isDrawerOpen).toBe(false);
  });
});

type TestProps = {
  drawerKey: string;
  initialEntry?: string;
};
function getHookRenderer({ drawerKey, initialEntry = "" }: TestProps) {
  return renderHook(() => useDrawerContentState(drawerKey), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    ),
  });
}
