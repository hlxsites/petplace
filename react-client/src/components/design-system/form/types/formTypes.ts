import { ReactNode } from "react";
import { CheckboxVariant } from "../../checkbox/Checkbox";
import { SwitchVariant } from "../../switch/Switch";
import { TitleProps } from "../../text/Title";
import { TextProps } from "../../types/TextTypes";

type VariableType = "string" | "number" | "date" | "string[]";
export type FormVariable = `{{${string}|${VariableType}}}`;

export type InputValue =
  | string
  | number
  | Date
  | boolean
  | string[]
  | FormValues[];

export type FormVariableValues = Record<string, InputValue>;
export type FormValues = Record<string, InputValue>;

export type ElementType =
  | "button"
  | "html"
  | "input"
  | "repeater"
  | "row"
  | "section";

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
  | "phone"
  | "url"
  | "date"
  | "time"
  | "hidden"
  | "select"
  | "switch"
  | "checkboxGroup"
  | "radio";

export type RepeaterMetadata = {
  index: number;
  repeaterId: string;
};

type ElementCommon = {
  className?: string;
  elementType: ElementType;
  id?: string;
  shouldDisplay?: ConditionExpression;
  repeaterMetadata?: RepeaterMetadata;
};

export type ElementSection = ElementCommon & {
  children: ElementUnion[];
  description?: Omit<TextProps, "children"> & {
    label: string;
  };
  elementType: "section";
  title: Omit<TitleProps, "children"> & {
    hideLabel?: boolean;
    label: string;
  };
};

export type ElementRepeater = Omit<ElementCommon, "id"> & {
  children: ElementUnion[];
  id: string;
  elementType: "repeater";
  labels?: {
    add?: string;
    remove?: string;
  };
  maxRepeat?: number;
  minRepeat?: number;
};

export type ElementRow = ElementCommon & {
  children: ElementUnion[];
  elementType: "row";
};

export type ElementHtml = Omit<ElementCommon, "id"> & {
  content: ReactNode;
  elementType: "html";
};

export type ElementButton = ElementCommon & {
  disabledCondition?: ConditionExpression;
  enabledCondition?: ConditionExpression;
  elementType: "button";
  id: string;
  label: string;
  onClick?: () => void;
  type: "button" | "reset" | "submit";
};

export type InputCommon = ElementCommon & {
  autoFocus?: boolean;
  description?: string;
  disabledCondition?: ConditionExpression;
  elementType: "input";
  errorMessage?: string | null;
  hideLabel?: boolean;
  id: string;
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
  type: "text" | "email" | "password" | "number";
  value?: string;
};

export type ElementInputPhone = InputCommon & {
  defaultType?: string;
  disabledType?: ConditionExpression;
  hideType?: ConditionExpression;
  onChange?: (newValue: string) => void;
  type: "phone";
  value?: string;
};

export type ElementInputTextarea = InputCommon & {
  onChange?: (newValue: string) => void;
  rows?: number;
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
    variant?: CheckboxVariant;
  };

export type ElementInputSwitch = Omit<InputCommon, "placeholder"> & {
  conditionalLabel?: [string, string];
  onChange?: (newValue: boolean) => void;
  type: "switch";
  value?: boolean;
  variant?: SwitchVariant;
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
  | ElementInputSwitch
  | ElementInputPhone
  | ElementInputRadio
  | ElementInputCheckboxGroup
  | ElementInputNumber
  | ElementInputDate
  | ElementInputSingleSelect
  | ElementInputMultiSelect;

export type ElementUnion =
  | ElementButton
  | ElementHtml
  | ElementRepeater
  | ElementRow
  | ElementSection
  | InputsUnion;

export type FormSchema = {
  children: ElementUnion[];
  id: string;
  version: number;
};
