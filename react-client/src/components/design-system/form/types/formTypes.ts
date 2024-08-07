import { ReactNode } from "react";

type VariableType = "string" | "number" | "date" | "string[]";
export type FormVariable = `{{${string}|${VariableType}}}`;

export type ElementType = "button" | "html" | "input" | "row" | "section";

export type InputValue = string | number | Date | boolean | string[];

type ConditionCriteriaCommon = {
  inputId: string;
  type:
    | "exists"
    | "null"
    | "="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "contains"
    | "regex";
};

type ConditionCriteriaDynamic = ConditionCriteriaCommon & {
  value: FormVariable;
  valueType: "dynamic";
};

type ConditionCriteriaStatic = ConditionCriteriaCommon & {
  value: InputValue;
  valueType?: "static";
};

export type ConditionCriteria =
  | ConditionCriteriaDynamic
  | ConditionCriteriaStatic;

export type ConditionExpression = boolean | ConditionCriteria | ConditionGroup;

export type ConditionGroup = {
  operator: "and" | "or";
  conditions: ConditionExpression[];
};

export type InputType =
  | "text"
  | "textarea"
  | "email"
  | "password"
  | "number"
  | "url"
  | "date"
  | "time"
  | "hidden"
  | "select"
  | "boolean"
  | "checkboxGroup"
  | "radio";

type ElementCommon = {
  id: string;
  shouldDisplay?: ConditionExpression;
  elementType: ElementType;
};

export type ElementSection = ElementCommon & {
  children: ElementUnion[];
  description?: string;
  elementType: "section";
  title?: string;
};

export type ElementRow = ElementCommon & {
  className?: string;
  children: ElementUnion[];
  elementType: "row";
};

export type ElementHtml = ElementCommon & {
  content: ReactNode;
  elementType: "html";
};

export type ElementButton = ElementCommon & {
  className?: string;
  disabledCondition?: ConditionExpression;
  elementType: "button";
  label: string;
  onClick?: () => void;
  type: "button" | "reset" | "submit";
};

export type InputCommon = ElementCommon & {
  autoFocus?: boolean;
  className?: string;
  description?: string;
  disabledCondition?: ConditionExpression;
  elementType: "input";
  errorMessage?: string;
  hideLabel?: boolean;
  label: string;
  placeholder?: string;
  requiredCondition?: ConditionExpression;
  type: InputType;
};

export type InputWithoutFormBuilderProps<T = InputCommon> = Omit<
  T,
  | "disabledCondition"
  | "elementType"
  | "shouldDisplay"
  | "requiredCondition"
  | "type"
> & {
  disabled?: boolean;
  required?: boolean;
};

export type ElementInputText = InputCommon & {
  onChange?: (newValue: string) => void;
  type: "text";
  value?: string;
};

export type ElementInputTextarea = InputCommon & {
  onChange?: (newValue: string) => void;
  type: "textarea";
  value?: string;
};

export type ElementInputBoolean = Omit<InputCommon, "placeholder"> & {
  onChange?: (newValue: boolean) => void;
  type: "boolean";
  value?: boolean;
};

type OptionType =
  | {
      options: string[];
      optionsType?: "static";
    }
  | {
      options: FormVariable;
      optionsType: "dynamic";
    };

export type ElementInputRadio = Omit<InputCommon, "placeholder"> &
  OptionType & {
    onChange?: (newValue: string) => void;
    type: "radio";
    value?: string;
  };

export type ElementInputCheckboxGroup = Omit<InputCommon, "placeholder"> &
  OptionType & {
    onChange?: (newValue: string[]) => void;
    type: "checkboxGroup";
    value?: string[];
  };

export type ElementInputNumber = InputCommon & {
  onChange?: (newValue: number) => void;
  type: "number";
  value?: number;
};

export type ElementInputDate = InputCommon & {
  onChange?: (newValue: Date) => void;
  type: "date";
  value?: Date;
};

type ElementInputSelectCommon = InputCommon &
  OptionType & {
    type: "select";
  };

export type ElementInputSingleSelect = ElementInputSelectCommon & {
  onChange?: (newValue: string) => void;
  value?: string;
};

export type ElementInputMultiSelect = ElementInputSelectCommon & {
  onChange?: (newValue: string[]) => void;
  value?: string[];
};

export type InputsUnion =
  | ElementInputText
  | ElementInputTextarea
  | ElementInputBoolean
  | ElementInputRadio
  | ElementInputCheckboxGroup
  | ElementInputNumber
  | ElementInputDate
  | ElementInputSingleSelect
  | ElementInputMultiSelect;

export type ElementUnion =
  | ElementButton
  | ElementHtml
  | ElementRow
  | ElementSection
  | InputsUnion;

export type FormSchema = {
  children: ElementUnion[];
  id: string;
  version: number;
};
