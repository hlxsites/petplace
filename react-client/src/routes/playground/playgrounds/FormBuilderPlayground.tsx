import { useState } from "react";
import { Button, DisplayForm, FormSchema } from "~/components/design-system";

export const FormBuilderPlayground = () => {
  const [dataStructure, setDataStructure] = useState({});
  const schema: FormSchema = {
    id: "form-playground",
    children: [
      {
        elementType: "repeater",
        id: "test-repeater",
        minRepeat: 1,
        children: [
          {
            elementType: "input",
            id: "name",
            label: "What is your pet name?",
            requiredCondition: true,
            type: "text",
          },
          {
            elementType: "input",
            id: "breed",
            label: "What's their breed?",
            options: ["Bulldog", "Doberman", "Mixed"],
            requiredCondition: true,
            type: "select",
          },
          {
            elementType: "input",
            id: "gender",
            label: "What's their gender?",
            options: ["Male", "Female"],
            requiredCondition: true,
            type: "radio",
          },
          {
            elementType: "input",
            id: "health-problems",
            label: "Have they ever had?",
            options: ["Fever", "Vomit", "Low appetite"],
            requiredCondition: true,
            type: "checkboxGroup",
          },
          {
            elementType: "input",
            id: "vaccine",
            label: "Have they ever been vaccinated?",
            requiredCondition: true,
            type: "switch",
          },
          {
            elementType: "input",
            id: "comments",
            label: "Other comments:",
            requiredCondition: true,
            type: "textarea",
          },
          {
            elementType: "input",
            id: "contact",
            label: "Contact:",
            requiredCondition: true,
            type: "phone",
          },
        ],
      },
    ],
    version: 0,
  };

  return (
    <div>
      <div className="mb-xxlarge flex w-full justify-center">
        <Button onClick={seeDataStructure}>Ver Estrutura de dados</Button>
      </div>
      <DisplayForm
        onChange={(props) => {
          setDataStructure(props);
          console.log("onChange values", props);
        }}
        onSubmit={({ event, values }) => {
          event.preventDefault();

          console.log("onSubmit values", values);
        }}
        schema={schema}
      />
    </div>
  );

  function seeDataStructure() {
    window.alert(JSON.stringify(dataStructure));
  }
};
