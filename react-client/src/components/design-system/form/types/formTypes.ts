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
  | "select"
  | "hidden"
  | "multiSelect"
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
  autoComplete?: HTMLInputElement["autocomplete"];
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
  maxLength?: number;
  minLength?: number;
  type: "text" | "email" | "password" | "number";
};

export type ElementInputHidden = Omit<InputCommon, "label" | "placeholder"> & {
  label?: string;
  id: string;
  type: "hidden";
};

export const AVAILABLE_PHONE_TYPES = ["Home", "Mobile", "Work"] as const;
type PhoneType = (typeof AVAILABLE_PHONE_TYPES)[number];

export type ElementInputPhone = InputCommon & {
  defaultType?: string;
  disabledType?: ConditionExpression;
  disallowedTypes?: PhoneType[];
  hideType?: ConditionExpression;
  type: "phone";
};

export type ElementInputTextarea = InputCommon & {
  rows?: number;
  type: "textarea";
};

export type ElementInputBoolean = Omit<InputCommon, "placeholder"> & {
  type: "boolean";
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
    type: "radio";
  };

export type ElementInputCheckboxGroup = Omit<InputCommon, "placeholder"> &
  OptionType & {
    type: "checkboxGroup";
    variant?: CheckboxVariant;
  };

export type ElementInputSwitch = Omit<InputCommon, "placeholder"> & {
  conditionalLabel?: [string, string];
  type: "switch";
  variant?: SwitchVariant;
};

export type ElementInputNumber = InputCommon & {
  type: "number";
};

export type ElementInputDate = InputCommon & {
  type: "date";
};

type ElementInputSelectCommon = InputCommon & OptionType;

export type ElementInputSingleSelect = ElementInputSelectCommon & {
  type: "select";
};

export type ElementInputMultiSelect = ElementInputSelectCommon & {
  type: "multiSelect";
};

export type InputsUnion =
  | ElementInputText
  | ElementInputTextarea
  | ElementInputBoolean
  | ElementInputHidden
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
