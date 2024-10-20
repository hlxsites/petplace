import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { useQuery } from "./useQuery";

jest.mock("~/infrastructure/telemetry/logUtils", () => ({
  logError: jest.fn(),
}));

describe("useQuery", () => {
  afterAll(() => {
    (logError as jest.Mock).mockReset();
  });

  it("should initialize with loading state", () => {
    const { result } = getHookRenderer();
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should initialize with loading state set to "false" when "skipOnMount" is set to "true"', () => {
    const { result } = getHookRenderer({ skipOnMount: true });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it("should automatically fetch data on mount", () => {
    const queryFn = jest.fn();

    getHookRenderer({ queryFn });
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("should skip fetching data on mount", () => {
    const queryFn = jest.fn();
    getHookRenderer({ queryFn, skipOnMount: true });

    expect(queryFn).not.toHaveBeenCalled();
  });

  it.each(["test data", "another data"])(
    "should automatically fetch data and update state to %p",
    async (expected) => {
      const queryFn = jest.fn().mockResolvedValue(expected);
      const { result, rerender } = getHookRenderer({ queryFn });

      rerender();
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBe(expected);
    }
  );

  it("should handle errors and log them", async () => {
    const error = new Error("test-error");
    const queryFn = jest.fn().mockRejectedValue(error);

    const { result, rerender } = getHookRenderer({ queryFn });

    rerender();
    await waitFor(() =>
      expect(logError).toHaveBeenCalledWith("useQuery fetchData error", error)
    );
    expect(result.current.data).toBeNull();
  });

  it("should refetch data", async () => {
    const queryFn = jest.fn().mockResolvedValue("test-data");
    const { result, rerender } = getHookRenderer({ queryFn });

    rerender();
    // Wait for the initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    queryFn.mockResolvedValueOnce("new-data");
    // Refetch the data
    act(result.current.refetch);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe("new-data");
  });

  it("should call the query function only once for the same key", async () => {
    const key = "same-key";
    const queryFn = jest.fn().mockResolvedValue("anything");
    getHookRenderer({ queryFn, key });

    getHookRenderer({ queryFn, key });

    const third = getHookRenderer({ queryFn, key });

    third.rerender();
    await waitFor(() => expect(third.result.current.loading).toBe(false));

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it.each(["test-the-same-data", "test-another-but-same-data"])(
    "should notify all observers",
    async (expected) => {
      const key = "same-key";
      const queryFn = jest.fn().mockResolvedValue(expected);
      const first = getHookRenderer({ queryFn, key });

      const second = getHookRenderer({
        queryFn,
        key,
        skipOnMount: true,
      });

      first.rerender();
      await waitFor(() => expect(first.result.current.loading).toBe(false));
      await waitFor(() => expect(second.result.current.loading).toBe(false));

      expect(first.result.current.data).toBe(expected);
      expect(second.result.current.data).toBe(expected);
    }
  );

  it("should notify observers when the key is the same and the data changes", async () => {
    const queryFn = jest.fn().mockResolvedValue("initial data");
    const key = "the-exact-same-key";
    const first = getHookRenderer({ queryFn, key });
    const second = getHookRenderer({ queryFn, key });

    first.rerender();
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    queryFn.mockResolvedValueOnce("new-data");
    // Refetch the data
    act(first.result.current.refetch);
    expect(first.result.current.loading).toBe(true);

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    expect(first.result.current.data).toBe("new-data");

    // The second observer should also change its data
    expect(second.result.current.data).toBe("new-data");
  });

  it("should not notify observers when the key is different", async () => {
    const queryFn = jest.fn().mockResolvedValue("initial data");
    const first = getHookRenderer({ queryFn, key: "key-1" });

    const second = getHookRenderer({ queryFn, key: "key-2" });

    first.rerender();
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    queryFn.mockResolvedValueOnce("new-data");
    // Refetch the data
    act(first.result.current.refetch);
    expect(first.result.current.loading).toBe(true);

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    expect(first.result.current.data).toBe("new-data");

    // The second observer should not change its data
    expect(second.result.current.data).toBe("initial data");
  });
});

// Helper functions
type Props = Parameters<typeof useQuery>[0];
function getHookRenderer({
  queryFn = jest.fn(),
  key = "test-key",
  ...rest
}: Partial<Props> = {}) {
  return renderHook(() =>
    useQuery({
      queryFn,
      key,
      ...rest,
    })
  );
}
