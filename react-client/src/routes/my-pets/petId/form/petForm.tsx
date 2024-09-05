import { FormSchema, InputsUnion, Text } from "~/components/design-system";

const petNameInput: InputsUnion = {
  elementType: "input",
  id: "name",
  label: "Pet name",
  errorMessage: "Please enter your pet's name.",
  requiredCondition: true,
  type: "text",
};

const speciesInput: InputsUnion = {
  elementType: "input",
  id: "type",
  label: "Species",
  options: ["Dog", "Cat"],
  requiredCondition: true,
  type: "select",
};

const sexInput: InputsUnion = {
  elementType: "input",
  id: "sex",
  label: "What's their gender?",
  options: ["Male", "Female"],
  requiredCondition: true,
  type: "select",
};

const breedInput: InputsUnion = {
  elementType: "input",
  id: "breed",
  label: "Breed",
  options: "{{breedOptions|string[]}}",
  optionsType: "dynamic",
  type: "select",
};

const ageInput: InputsUnion = {
  elementType: "input",
  id: "age",
  label: "Age",
  requiredCondition: true,
  type: "text",
};

const dobInput: InputsUnion = {
  elementType: "input",
  id: "dob",
  label: "Date of birth",
  requiredCondition: true,
  type: "text",
};

const microchipInput: InputsUnion = {
  elementType: "input",
  id: "microchip",
  label: "Microchip #",
  requiredCondition: true,
  type: "number",
};

const insuranceInput: InputsUnion = {
  elementType: "input",
  id: "insurance",
  label: "Insurance #",
  requiredCondition: true,
  type: "number",
};

export const addPetProfileFormSchema: FormSchema = {
  id: "add-pet-profile-form",
  children: [
    {
      ...petNameInput,
      description:
        "This can be your pet's current name, or a new name that you chose.",
    },
    {
      elementType: "row",
      children: [{ ...speciesInput, label: "Is your pet a" }, sexInput],
    },
    {
      elementType: "row",
      children: [
        {
          ...breedInput,
          description: `If you don't see it in the list below, select "other" at very bottom of the list.`,
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
      ],
    },
    {
      elementType: "row",
      children: [
        {
          elementType: "input",
          id: "birth-month",
          label: "Birth month",
          placeholder: "Month",
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
          placeholder: "Year",
          requiredCondition: true,
          type: "number",
        },
      ],
    },
    {
      content: (
        <Text size="16">
          Please ensure that all the information is complete and accurate. We
          may contact you periodically to ensure your information remains
          accurate and up to date.
        </Text>
      ),
      elementType: "html",
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
      elementType: "button",
      id: "submit-button",
      label: "Save pet",
      type: "submit",
    },
  ],
  version: 0,
};

export const editPetProfileFormSchema: FormSchema = {
  id: "edit-pet-profile-form",
  children: [
    {
      elementType: "row",
      children: [
        { ...petNameInput, label: "Name" },
        { ...breedInput, disabledCondition: true, requiredCondition: true },
      ],
    },
    {
      elementType: "row",
      children: [ageInput, dobInput],
    },
    {
      elementType: "row",
      children: [microchipInput],
    },
    {
      elementType: "row",
      children: [speciesInput],
    },
    {
      elementType: "row",
      children: [sexInput, { ...insuranceInput, disabledCondition: true }],
    },
    {
      className: "!mt-xxlarge",
      elementType: "row",
      children: [
        {
          elementType: "button",
          id: "discard-button",
          label: "Discard changes",
          type: "reset",
        },
        {
          elementType: "button",
          id: "submit-button",
          label: "Save changes",
          type: "submit",
        },
      ],
    },
  ],
  version: 0,
};
