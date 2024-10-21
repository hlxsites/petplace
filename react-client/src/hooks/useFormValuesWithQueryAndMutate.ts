import { isEqual } from "lodash";
import { useRef, useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  OnChangeFn,
  OnSubmitFn,
} from "~/components/design-system/form/FormBuilder";
import { logError, logWarning } from "~/infrastructure/telemetry/logUtils";
import { useDeepCompareEffect } from "./useDeepCompareEffect";
import { useQuery } from "./useQuery";

type UseQueryProps<TData> = Omit<
  Parameters<typeof useQuery<TData>>[0],
  "skipOnMount"
>;

type UseFormValuesWithQueryAndMutateProps<TData> = UseQueryProps<TData> & {
  /**
   * Callback to converts the query data to the FormValues type once the query is resolved.
   */
  convertQueryDataToFormValues: (data: TData) => FormValues;
  /**
   * Callback to (optionally) modify the form values before setting them.
   */
  onChangeMiddleware?: (values: FormValues) => FormValues;
  /**
   * Callback to mutate the form values when the form is submitted.
   * This function should return a boolean indicating if the mutation was successful.
   * If the mutation was successful, the initial form values will be updated to the new values.
   * If the mutation was not successful, the initial form values will remain the same.
   */
  mutateFn: (formValues: FormValues) => Promise<boolean>;
};

/**
 * Custom hook that manages form values with query and mutation capabilities.
 *
 * @template TData - The type of data expected from the query function.
 */
export function useFormValuesWithQueryAndMutate<TData>({
  convertQueryDataToFormValues,
  onChangeMiddleware,
  mutateFn,
  ...useQueryProps
}: UseFormValuesWithQueryAndMutateProps<TData>) {
  const initialFormValues = useRef<FormValues>({});

  const { data, loading: isLoading } = useQuery<TData>(useQueryProps);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  const isDirty = !isEqual(formValues, initialFormValues.current);

  useDeepCompareEffect(() => {
    if (data) {
      // We don't expect this effect to run more than once
      // after the initial data is fetched;
      // That's why we call it the initial values
      const initial = convertQueryDataToFormValues(data);

      initialFormValues.current = initial;
      setFormValues(initial);
    }
  }, [data]);

  const asyncSubmit = async (formId: string, values: FormValues) => {
    setIsSubmitting(true);

    try {
      const success = await mutateFn(values);
      if (success) {
        // Update the initial form values to the new submitted values
        initialFormValues.current = values;
      } else {
        logWarning("Form mutation failed", { formId, values });
      }
    } catch (error) {
      logError(`Error submitting form ${formId}`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitForm: OnSubmitFn = ({ formId, values }) => {
    void asyncSubmit(formId, values);
  };

  const onChangeForm: OnChangeFn = (values) => {
    // Allow the consumer to modify the values before setting them
    const newValues = onChangeMiddleware?.(values) ?? values;
    setFormValues(newValues);
  };

  return {
    formValues,
    isDirty,
    isLoading,
    isSubmitting,
    onChangeForm,
    onSubmitForm,
  };
}
