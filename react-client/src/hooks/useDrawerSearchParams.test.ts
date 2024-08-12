import { MemoryRouter, useSearchParams } from "react-router-dom";
import { useDrawerSearchParams } from "./useDrawerSearchParams";
import { renderHook } from "@testing-library/react";
import { act } from "react";

// Mock the useSearchParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

describe("useDrawerSearchParams", () => {
  const mockSetSearchParams = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);
  });

  it("should return isDrawerOpen as true when content matches drawerKey", () => {
    mockSearchParams.set("content", "testDrawer");
    const { result } = getRenderer();

    expect(result.current.isDrawerOpen).toBe(true);
  });

  it("should return isDrawerOpen as false when content does not match drawerKey", () => {
    mockSearchParams.set("content", "otherDrawer");
    const { result } = getRenderer();

    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("should call setSearchParams with correct params when onOpenDrawer is called", () => {
    mockSearchParams.set("existingParam", "value");
    const { result } = getRenderer();

    act(() => {
      result.current.onOpenDrawer();
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      existingParam: "value",
      content: "testDrawer",
    });
  });

  it("should call setSearchParams and delete content param when onCloseDrawer is called", () => {
    const { result } = getRenderer();

    act(() => {
      result.current.onCloseDrawer();
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
    const setParamsCallback = mockSetSearchParams.mock.calls[0][0];
    const mockNextParams = new URLSearchParams();
    mockNextParams.set("content", "testDrawer");
    setParamsCallback(mockNextParams);
    expect(mockNextParams.has("content")).toBe(false);
  });
});

type TestProps = {
  drawerKey: string;
};
function getRenderer({ drawerKey = "testDrawer" }: Partial<TestProps> = {}) {
  return renderHook(() => useDrawerSearchParams(drawerKey), {
    wrapper: MemoryRouter,
  });
}
