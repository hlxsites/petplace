import { FormBuilder, type FormBuilderProps } from "./FormBuilder";
import { type FormSchema, type FormVariableValues } from "./types/formTypes";
import { replaceVariablesInSettings } from "./utils/variableUtils";

type DisplayFormProps = Pick<
  FormBuilderProps,
  "onChange" | "onSubmit" | "values"
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
