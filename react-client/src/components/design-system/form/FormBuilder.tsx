import { isEqual } from "lodash";
import {
  Fragment,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { classNames } from "~/util/styleUtil";
import { Button } from "../button/Button";
import Input from "./Input";
import { InputBoolean } from "./InputBoolean";
import { InputCheckboxGroup } from "./InputCheckboxGroup";
import { InputRadio } from "./InputRadio";
import { InputTextarea } from "./InputTextarea";
import Select from "./Select";
import {
  type ConditionCriteria,
  type ConditionExpression,
  type ElementSection,
  type ElementUnion,
  type FormSchema,
  type InputValue,
  type InputsUnion,
} from "./types/formTypes";
type FormValues = { [key: string]: InputValue };

const isDevEnvironment = window.location.hostname === "localhost";

type OnSubmitProps = {
  event: FormEvent<HTMLFormElement>;
  values: FormValues;
};

type RenderedInput = Omit<
  InputsUnion,
  "disabledCondition" | "elementType" | "shouldDisplay" | "requiredCondition"
> & {
  disabled: boolean;
  required: boolean;
};

export type FormBuilderProps = {
  schema: FormSchema;
  onChange?: (values: FormValues) => void;
  onSubmit?: (props: OnSubmitProps) => void;
  values?: Record<string, InputValue>;
};

export const FormBuilder = ({
  schema,
  onChange,
  onSubmit,
  values: defaultValues,
}: FormBuilderProps) => {
  const initialDefaultValues = useRef<FormValues>(defaultValues || {});

  const [values, setValues] = useState<FormValues>(defaultValues || {});
  const [didSubmit, setDidSubmit] = useState(false);

  // Object to store the rendered fields, can't use a ref because we want a clean object on each render
  const renderedFields: RenderedInput[] = [];

  // Check if any of the rendered fields has an error message
  const hasValidationError = renderedFields.some((f) => !!f.errorMessage);

  useDeepCompareEffect(() => {
    // Notify onChange callback only if the values have changed
    if (!!onChange && !isEqual(initialDefaultValues.current, values)) {
      onChange(values);
    }
  }, [onChange, values]);

  return (
    <div className="bg-background p-8 m-auto max-w-screen-lg">
      <form id={schema.id} noValidate onSubmit={onSubmitHandler}>
        <div className="space-y-large">
          {schema.children.map(renderElement)}
        </div>
      </form>
    </div>
  );

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    if (hasValidationError) {
      event.preventDefault();
      setDidSubmit(true);

      return null;
    }

    setDidSubmit(true);

    if (onSubmit) onSubmit({ event, values });

    return values;
  }

  function renderElement(element: ElementUnion) {
    if (!matchConditionExpression(element.shouldDisplay ?? true)) return null;

    switch (element.elementType) {
      case "section":
        return <Fragment key={element.id}>{renderSection(element)}</Fragment>;
      case "html":
        return <Fragment key={element.id}>{element.content}</Fragment>;
      case "row":
        return (
          <div
            className={classNames(
              "flg:flex-row gap-base lg:flex [&>*]:grow [&>*]:basis-0",
              element.className
            )}
            key={element.id}
          >
            {element.children.map(renderElement)}
          </div>
        );
      case "button":
        return (
          <Button
            className={element.className}
            key={element.id}
            type={element.type}
          >
            {element.label}
          </Button>
        );
      case "input":
        return <Fragment key={element.id}>{renderInput(element)}</Fragment>;
      default:
        if (isDevEnvironment) {
          // @ts-expect-error - we expect it to throw an error when a new element is added in the form builder types but not implemented here yet
          throw new Error(`Unsupported element type: ${element.elementType}`);
        }
        return null;
    }
  }

  function renderInput({
    disabledCondition,
    requiredCondition,
    shouldDisplay,
    ...inputProps
  }: InputsUnion): ReactNode {
    if (!matchConditionExpression(shouldDisplay ?? true)) return null;

    const disabled = matchConditionExpression(disabledCondition ?? false);
    const required = matchConditionExpression(requiredCondition ?? false);

    const { id, type } = inputProps;

    const commonProps = {
      disabled,
      required,
      ...inputProps,
    };

    // Validate the input and add the error message to the props if necessary
    const errorMessage = didSubmit ? validateInput(commonProps) : null;
    commonProps["errorMessage"] = errorMessage || undefined;

    renderedFields.push({
      ...commonProps,
    });

    if (type === "select") {
      const { options } = inputProps;
      return (
        <Select
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          options={options as string[]}
          value={(values?.[id] as string) || ""}
        />
      );
    }

    if (type === "radio") {
      return (
        <InputRadio
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          options={(inputProps.options as string[]) || []}
          value={(values?.[id] as string) || ""}
        />
      );
    }
    if (type === "checkboxGroup") {
      return (
        <InputCheckboxGroup
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          options={(inputProps.options as string[]) || []}
          value={(values?.[id] as string[]) || []}
        />
      );
    }
    if (type === "boolean") {
      return (
        <InputBoolean
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          value={
            typeof values?.[id] !== "undefined" ? !!values?.[id] : undefined
          }
        />
      );
    }

    if (type === "textarea") {
      return (
        <InputTextarea
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          value={(values?.[id] as string) || ""}
        />
      );
    }

    if (type === "text" || type === "number") {
      return (
        <Input
          {...commonProps}
          onChange={(newValue) => {
            setValues((prev) => ({ ...prev, [id]: newValue }));
          }}
          value={(values?.[id] as string) || ""}
          type={type}
        />
      );
    }

    if (isDevEnvironment) throw new Error(`Unsupported input type: ${type}`);

    return null;
  }

  function renderSection({
    children,
    description,
    id,
    shouldDisplay,
    title,
  }: ElementSection) {
    if (!matchConditionExpression(shouldDisplay || true)) return;
    return (
      <section className="my-small" id={id}>
        {!!title && <h2 className="text-h2">{title}</h2>}
        {!!description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
        <div className="mt-xsmall space-y-xsmall">
          {children.map(renderElement)}
        </div>
      </section>
    );
  }

  function matchConditionExpression(condition: ConditionExpression): boolean {
    if (typeof condition === "boolean") return condition;

    // if it's a single condition, just check if it matches
    if ("type" in condition) return didMatchCondition(condition);

    // It should be a group of conditions if reached here
    const { operator, conditions } = condition;
    if (operator === "and") return conditions.every(matchConditionExpression);
    if (operator === "or") return conditions.some(matchConditionExpression);

    return false;
  }

  function didMatchCondition({
    inputId,
    value,
    type,
  }: ConditionCriteria): boolean {
    // Get the current value from form values
    const currentValue = values?.[inputId];

    if (type === "contains") {
      if (typeof currentValue !== "string") {
        console.warn('"contains" condition can only be used for strings');
        return false;
      }

      return currentValue.includes(value as string);
    }

    if (type === "regex") {
      if (typeof currentValue !== "string" || typeof value !== "string") {
        console.warn('"regex" condition can only be used for strings');
        return false;
      }

      try {
        const regex = new RegExp(value);
        return regex.test(currentValue);
      } catch (error) {
        console.warn('Invalid regex pattern for "regex" condition');
        return false;
      }
    }

    if (type === "exists") return !!currentValue;

    if (type === "null") return !currentValue;

    if (type === "=") return currentValue === value;

    if (type === "!=") return currentValue !== value;

    if (["<", ">", "<=", ">="].includes(type)) {
      if (currentValue === undefined || value === undefined) return false;

      // Function to handle numerical comparisons
      const numericalComparison = (a: number, b: number) => {
        if (type === "<") return a < b;
        if (type === ">") return a > b;
        if (type === "<=") return a <= b;
        if (type === ">=") return a >= b;

        // This should never happen
        return false;
      };

      // Comparisons for numbers
      if (typeof currentValue === "number" && typeof value === "number") {
        return numericalComparison(currentValue, value);
      }

      // Comparisons for dates
      if (currentValue instanceof Date && value instanceof Date) {
        return numericalComparison(currentValue.getTime(), value.getTime());
      }

      console.warn(
        "Cannot compare non-numeric/non-date values for numeric/date operation"
      );
    }

    return false;
  }

  function validateInput(input: RenderedInput): string | null {
    if (input.disabled) return null;

    const { errorMessage, required, type } = input;

    if (required && !inputValueExist(input)) {
      if (errorMessage) return errorMessage;

      if (["radio", "select"].includes(type)) {
        return "Select an option";
      }

      if (type === "checkboxGroup") return "Select at least one option";
      if (type === "boolean") return "Answer yes or no";

      return "Fill this field";
    }

    return null;
  }

  function inputValueExist({ id }: RenderedInput): boolean {
    const value = values?.[id];

    if (typeof value === "undefined") return false;

    if (Array.isArray(value)) return !!value.length;

    if (typeof value === "string") return !!value.length;

    return true;
  }
};
