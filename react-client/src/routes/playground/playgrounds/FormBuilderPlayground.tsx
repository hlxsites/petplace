import { DisplayForm, Text } from "~/components/design-system";
import { FormSchema } from "~/components/design-system/form/types/formTypes";

export const FormBuilderPlayground = () => {
  const schema: FormSchema = {
    id: "form-playground",
    children: [
      {
        elementType: "input",
        description:
          "This can be your pet's current name, or a new name that you chose.",
        id: "name",
        label: "Pet name",
        errorMessage: "Please enter your pet's name.",
        requiredCondition: true,
        type: "text",
      },
      {
        elementType: "input",
        id: "type",
        label: "Is your pet a",
        options: ["Dog", "Cat"],
        requiredCondition: true,
        type: "select",
      },
      {
        elementType: "input",
        id: "gender",
        label: "What's their gender?",
        options: ["Male", "Female"],
        requiredCondition: true,
        type: "select",
      },
      {
        id: "breed-row",
        elementType: "row",
        children: [
          {
            description: `If you don't see it in the list below, select "other" at very bottom of the list.`,
            elementType: "input",
            id: "breed",
            label: "Breed",
            options: "{{breedOptions|string[]}}",
            optionsType: "dynamic",
            type: "select",
          },
          {
            description: `If you don't see your pet's color, please select "other" located at the bottom of the list.`,
            elementType: "input",
            id: "color",
            label: "Color",
            options: "{{colorOptions|string[]}}",
            optionsType: "dynamic",
            requiredCondition: true,
            type: "select",
          },
        ],
      },
      {
        id: "breed-type-spayed",
        elementType: "row",
        children: [
          {
            elementType: "input",
            id: "breed-type",
            label: "What's their breed type?",
            options: "{{breedTypeOptions|string[]}}",
            optionsType: "dynamic",
            requiredCondition: true,
            type: "select",
          },
          {
            elementType: "input",
            id: "spayed-neutered",
            label: "Are they spayed or neutered?",
            requiredCondition: true,
            type: "boolean",
          },
        ],
      },
      {
        elementType: "input",
        id: "birth-month",
        label: "Birth month",
        requiredCondition: true,
        options: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        type: "select",
      },
      {
        elementType: "input",
        id: "birth-year",
        label: "Birth year",
        requiredCondition: true,
        type: "number",
      },
      {
        content: (
          <Text size="base">
            Please ensure that all the information is complete and accurate. We
            may contact you periodically to ensure your information remains
            accurate and up to date.
          </Text>
        ),
        elementType: "html",
        id: "text-note",
      },
      {
        elementType: "input",
        hideLabel: true,
        id: "consent",
        label: "Consent to release information",
        errorMessage: "You must consent to release your information.",
        options: [
          "Do you consent to the release of my name, email, address and telephone number to anyone who finds your pet? You may withdraw your consent at any time.",
        ],
        requiredCondition: true,
        type: "checkboxGroup",
      },
      {
        className: "w-full mt-xxlarge",
        elementType: "button",
        id: "submit",
        label: "Save pet",
        type: "submit",
      },
    ],
    version: 0,
  };

  return (
    <DisplayForm
      isDevEnvironment
      onChange={(props) => {
        console.log("onChange values", props);
      }}
      onSubmit={({ event, values }) => {
        event.preventDefault();

        console.log("onSubmit values", values);
      }}
      schema={schema}
      variables={{
        // This could come from an API request, for example
        breedOptions: [
          "Poodle",
          "Golden Retriever",
          "Labrador",
          "Pug",
          "Beagle",
        ],
        breedTypeOptions: [],
        colorOptions: ["Black", "White", "Brown", "Grey", "Golden"],
      }}
    />
  );
};
