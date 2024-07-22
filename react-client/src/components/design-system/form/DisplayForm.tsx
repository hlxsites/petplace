import { FormBuilder, type FormBuilderProps } from "./FormBuilder";
import { type FormSchema, type InputValue } from "./types/formTypes";
import { replaceVariablesInSettings } from "./utils/variableUtils";

type DisplayFormProps = Pick<
  FormBuilderProps,
  "isDevEnvironment" | "onChange" | "onSubmit"
> & {
  schema: FormSchema;
  variables?: Record<string, InputValue>;
};

export const DisplayForm = ({
  schema,
  variables,
  ...rest
}: DisplayFormProps) => {
  const updatedSchema = replaceVariablesInSettings(schema, variables);

  return <FormBuilder schema={updatedSchema} {...rest} />;
};
