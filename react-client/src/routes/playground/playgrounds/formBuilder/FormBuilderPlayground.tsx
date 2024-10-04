import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  DisplayForm,
  FormSchema,
  FormValues,
  Title,
} from "~/components/design-system";
import Select from "~/components/design-system/form/Select";
import {
  basicSchema,
  fieldDependOnAnotherSchema,
  repeaterSchema,
} from "./schemas";

export const FormBuilderPlayground = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [values, setValues] = useState<FormValues>({});

  const selectedForm = searchParams.get("form") || "basic";

  const setSelectedForm = (newValue: string) => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set("form", newValue);
      return nextSearchParams;
    });
  };

  const schema = (() => {
    const mapper: Record<string, FormSchema> = {
      basic: basicSchema,
      "field depends on another": fieldDependOnAnotherSchema,
      repeater: repeaterSchema,
    };
    return mapper[selectedForm] || basicSchema;
  })();

  const onChange = (newValue: FormValues) => {
    if (selectedForm === "field depends on another" && newValue["name"]) {
      if (newValue["name"] !== values["name"]) {
        newValue["microchip"] = newValue["name"] === "Bob" ? "123FA" : "222BB";
      }
    }

    setValues(newValue);
  };

  return (
    <div className="flex flex-col gap-xxlarge">
      <Card padding="base" overflow="visible">
        <Select
          id="form-schema-selector"
          label="Select the schema"
          options={["basic", "field depends on another", "repeater"]}
          onChange={(newValue) => {
            setValues({});
            setSelectedForm(newValue);
          }}
          required
          value={selectedForm}
        />
      </Card>

      <div className="flex flex-col gap-base">
        <Title level="h2">Displaying form: {selectedForm}</Title>
        <DisplayForm
          onChange={onChange}
          key={selectedForm}
          onSubmit={({ values }) => {
            window.alert(JSON.stringify(values));
          }}
          schema={schema}
          values={values}
        />
      </div>
    </div>
  );
};
