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
import { Text } from "../text/Text";
import { Title } from "../text/Title";
import { FormRepeater } from "./FormRepeater";
import Input from "./Input";
import { InputCheckboxGroup } from "./InputCheckboxGroup";
import { InputPhone } from "./InputPhone";
import { InputRadio } from "./InputRadio";
import { InputSwitch } from "./InputSwitch";
import { InputTextarea } from "./InputTextarea";
import Select from "./Select";
import {
  type ConditionCriteria,
  type ConditionExpression,
  type ElementSection,
  type ElementUnion,
  type FormSchema,
  type FormValues,
  type InputsUnion,
  type InputValue,
} from "./types/formTypes";
import {
  idWithRepeaterMetadata,
  textWithRepeaterMetadata,
} from "./utils/formRepeaterUtils";

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
  values?: FormValues;
};

export const FormBuilder = ({
  schema,
  onChange,
  onSubmit,
  values: defaultValues,
}: FormBuilderProps) => {
  const defaultValuesRef = useRef<FormValues>(defaultValues || {});

  const [values, setValues] = useState<FormValues>(defaultValuesRef.current);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  // Object to store the rendered fields, can't use a ref because we want a clean object on each render
  const renderedFields: RenderedInput[] = [];

  // Check if any of the rendered fields has an error message
  const hasValidationError = renderedFields.some((f) => !!f.errorMessage);

  useDeepCompareEffect(() => {
    const formChanged = !isEqual(defaultValuesRef.current, values);

    // Set form as changed if values differ from the default values
    setIsFormChanged(formChanged);

    // Notify onChange callback only if the values have changed
    if (!!onChange && formChanged) {
      onChange(values);
    }
  }, [onChange, values]);

  return (
    <form
      className="space-y-large"
      id={schema.id}
      noValidate
      onSubmit={onSubmitHandler}
    >
      {schema.children.map(renderElement)}
    </form>
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

  function renderElement(element: ElementUnion, index: number) {
    if (!matchConditionExpression(element.shouldDisplay ?? true)) return null;

    const { elementType } = element;

    if (elementType === "input") {
      return <Fragment key={element.id}>{renderInput(element)}</Fragment>;
    } else if (elementType === "button") {
      const disabled = (() => {
        if (matchConditionExpression(element.enabledCondition ?? false))
          return !isFormChanged;

        return matchConditionExpression(element.disabledCondition ?? false);
      })();

      return (
        <Button
          className={element.className}
          disabled={disabled}
          key={element.id}
          type={element.type}
          variant={element.type === "submit" ? "primary" : "secondary"}
        >
          {element.label}
        </Button>
      );
    }

    const elementKey = `${elementType}-${index}`;
    switch (elementType) {
      case "repeater":
        return (
          <FormRepeater
            key={elementKey}
            {...element}
            onChange={(newValues) => {
              setValues((prev) => ({ ...prev, [element.id]: newValues }));
            }}
            renderElement={renderElement}
            values={values}
          />
        );
      case "section":
        return <Fragment key={elementKey}>{renderSection(element)}</Fragment>;
      case "html":
        return <Fragment key={elementKey}>{element.content}</Fragment>;
      case "row":
        return (
          <div
            className={classNames(
              "flex flex-col gap-base lg:flex-row [&>*]:grow [&>*]:basis-0",
              element.className
            )}
            key={elementKey}
            id={element.id}
          >
            {element.children.map((e, i) =>
              renderElement(
                { ...e, repeaterMetadata: element.repeaterMetadata },
                i
              )
            )}
          </div>
        );
      default:
        if (isDevEnvironment) {
          // @ts-expect-error - we expect it to throw an error when a new element is added in the form builder types but not implemented here yet
          throw new Error(`Unsupported element type: ${element.elementType}`);
        }
        return null;
    }
  }

  function renderInput({
    id: inputId,
    disabledCondition,
    label: inputLabel,
    requiredCondition,
    repeaterMetadata,
    ...inputProps
  }: InputsUnion): ReactNode {
    const disabled = matchConditionExpression(disabledCondition ?? false);
    const required = matchConditionExpression(requiredCondition ?? false);

    const { type } = inputProps;

    const id = idWithRepeaterMetadata(inputId, repeaterMetadata);
    const label = textWithRepeaterMetadata(inputLabel, repeaterMetadata);

    const commonProps = {
      id,
      disabled,
      label,
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
          onChange={handleInputChange}
          options={options as string[]}
          value={getStringValue()}
        />
      );
    }

    if (type === "radio") {
      return (
        <InputRadio
          {...commonProps}
          onChange={handleInputChange}
          options={(inputProps.options as string[]) || []}
          value={getStringValue()}
        />
      );
    }
    if (type === "checkboxGroup") {
      return (
        <InputCheckboxGroup
          {...commonProps}
          onChange={handleInputChange}
          options={(inputProps.options as string[]) || []}
          value={getStringArrayValue()}
        />
      );
    }
    if (type === "switch") {
      return (
        <InputSwitch
          {...commonProps}
          onChange={handleInputChange}
          value={getBooleanValue()}
        />
      );
    }

    if (type === "textarea") {
      return (
        <InputTextarea
          {...commonProps}
          onChange={handleInputChange}
          rows={inputProps.rows}
          value={getStringValue()}
        />
      );
    }

    if (type === "phone") {
      return (
        <InputPhone
          {...commonProps}
          disabledType={matchConditionExpression(
            inputProps.disabledType ?? false
          )}
          hideType={matchConditionExpression(inputProps.hideType ?? false)}
          onChange={handleInputChange}
          value={getStringValue()}
        />
      );
    }

    if (
      type === "email" ||
      type === "text" ||
      type === "number" ||
      type === "password"
    ) {
      return (
        <Input
          {...commonProps}
          onChange={handleInputChange}
          value={getStringValue()}
          type={type}
        />
      );
    }

    if (isDevEnvironment) throw new Error(`Unsupported input type: ${type}`);

    return null;

    function handleInputChange(newValue: InputValue) {
      setValues((prev) => {
        const inputId = getInputId();

        if (!repeaterMetadata) return { ...prev, [inputId]: newValue };

        const { repeaterId, index } = repeaterMetadata;
        const processedValue = (() => {
          const current = prev[repeaterId];
          if (current && Array.isArray(current)) {
            return (current as FormValues[]).map((item, i) => {
              if (index !== i) return item;

              return {
                ...item,
                [inputId]: newValue,
              };
            });
          }

          return [];
        })();
        return { ...prev, [repeaterId]: processedValue };
      });
    }

    function getStringValue() {
      return (getInputValue() as string) || "";
    }

    function getBooleanValue() {
      return !!getInputValue();
    }

    function getStringArrayValue() {
      return (getInputValue() as string[]) || [];
    }

    function getInputValue() {
      const inputId = getInputId();
      if (!repeaterMetadata) return values?.[inputId];

      const { repeaterId, index } = repeaterMetadata;
      // @ts-expect-error this value goes too deep for ts to understand
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return values?.[repeaterId]?.[index]?.[inputId];
    }

    function getInputId() {
      if (!repeaterMetadata) return id;
      return id.split("_repeater_")[0];
    }
  }

  function renderSection({
    children,
    className,
    description,
    id,
    repeaterMetadata,
    title,
  }: ElementSection) {
    const titleElement = (() => {
      if (title.hideLabel) return null;

      const { label, level, size, ...rest } = title;
      return (
        <Title level={level ?? "h2"} size={size ?? "18"} {...rest}>
          {textWithRepeaterMetadata(label, repeaterMetadata)}
        </Title>
      );
    })();

    const descriptionElement = (() => {
      if (!description) return null;

      const { label, ...rest } = description;
      return (
        <Text {...rest}>
          {textWithRepeaterMetadata(label, repeaterMetadata)}
        </Text>
      );
    })();

    return (
      <section
        aria-label={title.hideLabel ? title.label : undefined}
        className={classNames("my-small", className)}
        id={id}
      >
        {titleElement}
        {descriptionElement}
        <div
          className={classNames("space-y-base", {
            "mt-base": !!title || !!description,
          })}
        >
          {children.map((e, i) => renderElement({ ...e, repeaterMetadata }, i))}
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
