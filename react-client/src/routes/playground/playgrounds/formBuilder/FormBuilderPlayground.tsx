import { useState } from "react";
import {
  Card,
  DisplayForm,
  FormSchema,
  Title,
} from "~/components/design-system";
import Select from "~/components/design-system/form/Select";
import { basicSchema, repeaterSchema } from "./schemas";

export const FormBuilderPlayground = () => {
  const [selectedForm, setSelectedForm] = useState<string>("basic");

  const schema = (() => {
    const mapper: Record<string, FormSchema> = {
      basic: basicSchema,
      repeater: repeaterSchema,
    };
    return mapper[selectedForm] || basicSchema;
  })();

  return (
    <div className="flex flex-col gap-xxlarge">
      <Card padding="base" overflow="visible">
        <Select
          id="form-schema-selector"
          label="Select the schema"
          options={["basic", "repeater"]}
          onChange={setSelectedForm}
          required
          value={selectedForm}
        />
      </Card>

      <div className="flex flex-col gap-base">
        <Title level="h2">Displaying form: {selectedForm}</Title>
        <DisplayForm
          onChange={(props) => {
            console.log("onChange values", props);
          }}
          key={selectedForm}
          onSubmit={({ values }) => {
            window.alert(JSON.stringify(values));
          }}
          schema={schema}
        />
      </div>
    </div>
  );
};
