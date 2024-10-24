import { act, renderHook, waitFor } from "@testing-library/react";
import { logError, logWarning } from "~/infrastructure/telemetry/logUtils";
import { useFormValuesWithQueryAndMutate } from "./useFormValuesWithQueryAndMutate";
import { useQuery } from "./useQuery";

jest.mock("~/infrastructure/telemetry/logUtils", () => ({
  logError: jest.fn(),
  logWarning: jest.fn(),
}));

jest.mock("./useQuery", () => ({
  useQuery: jest.fn(),
}));

const useQueryMock = useQuery as jest.Mock;

const FORM_SUBMIT_OBJECT = {
  event: {} as React.FormEvent<HTMLFormElement>,
  formId: "test-form",
};

describe("useFormValuesWithQueryAndMutate", () => {
  beforeEach(() => {
    useQueryMock.mockReturnValue({ data: null, loading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    useQueryMock.mockReturnValue({ data: null, loading: true });

    const { result } = getHookRenderer();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.formValues).toStrictEqual({});
  });

  it("should update form values on change", () => {
    const newValues = { field: "new" };

    const { result } = getHookRenderer();

    act(() => {
      result.current.onChangeForm(newValues);
    });

    expect(result.current.formValues).toStrictEqual(newValues);
  });

  describe("isDirty", () => {
    it("should set it to true when form values change", () => {
      const data = { field: "whatever" };
      useQueryMock.mockReturnValue({ data, loading: false });
      const { result } = getHookRenderer();

      act(() => {
        result.current.onChangeForm({ field: "new" });
      });

      expect(result.current.isDirty).toBe(true);
    });

    it("should set it to false when form values changes back as initial value", async () => {
      const data = { field: "whatever" };
      useQueryMock.mockReturnValue({ data, loading: false });
      const { result } = getHookRenderer();

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));

      // Change the form value
      result.current.onChangeForm({ field: "new" });

      // Revert back to the original form value
      result.current.onChangeForm(data);
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe("convertQueryDataToFormValues callback", () => {
    it.each(["data", "another-data"])(
      "should call it with the data %p returned by the query",
      (expected) => {
        const data = { test: expected };
        useQueryMock.mockReturnValue({ data, loading: false });
        const convertQueryDataToFormValues = jest.fn();

        getHookRenderer({ convertQueryDataToFormValues });

        expect(convertQueryDataToFormValues).toHaveBeenCalledWith(data);
      }
    );

    it.each([
      ["Bob", 10],
      ["Duda", 4],
    ])(
      "should set form values received from the query name=%p and age=%p",
      async (name, age) => {
        useQueryMock.mockReturnValue({ data: { age, name }, loading: false });
        const convertQueryDataToFormValues = jest.fn((data) =>
          Promise.resolve(data)
        );
        const { result } = getHookRenderer({ convertQueryDataToFormValues });

        await act(async () => {
          await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
          });
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.formValues).toStrictEqual({ age, name });
      }
    );

    it("should set form values returned by the callback when data is fetched", async () => {
      const data = { test: "data" };
      const formValues = { field: "value" };
      useQueryMock.mockReturnValue({ data, loading: false });

      const convertQueryDataToFormValues = jest
        .fn()
        .mockResolvedValue(formValues);

      const { result } = getHookRenderer({ convertQueryDataToFormValues });

      await act(async () => {
        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });
      });

      expect(result.current.formValues).toStrictEqual(formValues);
    });
  });

  describe("mutate callback", () => {
    it("should handle form submission successfully", async () => {
      const submittedFormValues = { field: "value" };
      const mutateFn = jest.fn().mockResolvedValue(true);

      const { result } = getHookRenderer({ mutateFn });

      result.current.onSubmitForm({
        ...FORM_SUBMIT_OBJECT,
        values: submittedFormValues,
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      expect(mutateFn).toHaveBeenCalledWith(submittedFormValues);
      expect(logWarning).not.toHaveBeenCalled();
    });

    it("should set the form values that was submitted", () => {
      const mutateFn = jest.fn().mockResolvedValue(true);

      const { result } = getHookRenderer({ mutateFn });

      const submittedFormValues = { field: "updated value" };
      // Change and submit the form
      act(() => {
        result.current.onChangeForm(submittedFormValues);

        result.current.onSubmitForm({
          ...FORM_SUBMIT_OBJECT,
          values: submittedFormValues,
        });
      });
      expect(result.current.formValues).toStrictEqual(submittedFormValues);
    });

    it("should handle form submission failure", async () => {
      const formValues = { field: "value" };
      const mutateFn = jest.fn().mockResolvedValue(false);

      const { result } = getHookRenderer({ mutateFn });

      result.current.onSubmitForm({
        ...FORM_SUBMIT_OBJECT,
        values: formValues,
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      expect(mutateFn).toHaveBeenCalledWith(formValues);
      expect(logWarning).toHaveBeenCalledWith("Form mutation failed", {
        formId: "test-form",
        values: formValues,
      });
    });

    it("should not the form values that was submitted when it is a failure", async () => {
      const data = { field: "whatever" };
      useQueryMock.mockReturnValue({ data, loading: false });

      const mutateFn = jest.fn().mockResolvedValue(false);
      const { result } = getHookRenderer({ mutateFn });

      const submittedFormValues = { field: "new value" };
      result.current.onSubmitForm({
        ...FORM_SUBMIT_OBJECT,
        values: submittedFormValues,
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      expect(result.current.formValues).toStrictEqual(data);
    });

    it("should handle form submission error", async () => {
      const formValues = { field: "value" };
      const error = new Error("test-error");
      const mutateFn = jest.fn().mockRejectedValue(error);
      const { result } = getHookRenderer({ mutateFn });

      result.current.onSubmitForm({
        ...FORM_SUBMIT_OBJECT,
        values: formValues,
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      expect(mutateFn).toHaveBeenCalledWith(formValues);
      expect(logError).toHaveBeenCalledWith(
        "Error submitting form test-form",
        error
      );
    });

    it("should set isDirty back to false when the form is submitted with success", async () => {
      const data = { field: "whatever" };
      useQueryMock.mockReturnValue({ data, loading: false });
      const { result } = getHookRenderer();
      await waitFor(() => expect(result.current.isSubmitting).toBe(false));

      // Change the form value
      act(() => {
        result.current.onChangeForm({ field: "updated" });
      });
      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.onSubmitForm({
          ...FORM_SUBMIT_OBJECT,
          values: { field: "updated" },
        });
      });
      await waitFor(() => expect(result.current.isDirty).toBe(false));
    });
  });

  describe("onChangeMiddleware callback", () => {
    it('should call it with the values provided by "onChangeForm"', () => {
      const newValues = { field: "new data value" };
      const onChangeMiddleware = jest.fn();

      const { result } = getHookRenderer({ onChangeMiddleware });

      act(() => {
        result.current.onChangeForm(newValues);
      });

      expect(onChangeMiddleware).toHaveBeenCalledWith(newValues);
    });

    it("should apply changes if provided", () => {
      const newValues = { field: "new" };
      const middlewareValues = { field: "middleware" };
      const onChangeMiddleware = jest.fn().mockReturnValue(middlewareValues);

      const { result } = getHookRenderer({ onChangeMiddleware });

      act(() => {
        result.current.onChangeForm(newValues);
      });

      expect(result.current.formValues).toStrictEqual(middlewareValues);
      expect(onChangeMiddleware).toHaveBeenCalledWith(newValues);
    });
  });
});

// Helper functions
type Props = Parameters<typeof useFormValuesWithQueryAndMutate>[0];
function getHookRenderer({
  // @ts-expect-error - default to just passing the form values
  convertQueryDataToFormValues = (formValues) => formValues,
  queryFn = jest.fn(),
  key = "test-key",
  mutateFn = jest.fn().mockResolvedValue(true),
  ...rest
}: Partial<Props> = {}) {
  return renderHook(() =>
    useFormValuesWithQueryAndMutate({
      convertQueryDataToFormValues,
      queryFn,
      key,
      mutateFn,
      ...rest,
    })
  );
}
