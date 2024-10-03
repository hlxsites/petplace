import { useState } from "react";
import { DisplayForm } from "./DisplayForm";
import { type FormBuilderProps } from "./FormBuilder";
import {
  FormValues,
  type FormSchema,
  type FormVariableValues,
} from "./types/formTypes";

type DisplayFormProps = Pick<FormBuilderProps, "onSubmit" | "onDeleteRepeater"> & {
  initialValues?: FormValues;
  schema: FormSchema;
  variables?: FormVariableValues;
};

export const DisplayUncontrolledForm = ({
  initialValues,
  ...rest
}: DisplayFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues || {});

  return <DisplayForm onChange={setValues} values={values} {...rest} />;
};
