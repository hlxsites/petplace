import { FormBuilder, type FormBuilderProps } from "./FormBuilder";
import { type FormSchema, type FormVariableValues } from "./types/formTypes";
import { replaceVariablesInSettings } from "./utils/variableUtils";

export type DisplayFormProps = Pick<
  FormBuilderProps,
  "isDirty" | "isSubmitting" | "onChange" | "onReset" | "onSubmit" | "values"
> & {
  schema: FormSchema;
  variables?: FormVariableValues;
};

export const DisplayForm = ({
  schema,
  variables,
  ...rest
}: DisplayFormProps) => {
  const updatedSchema = replaceVariablesInSettings(schema, variables);

  return <FormBuilder schema={updatedSchema} {...rest} />;
};
