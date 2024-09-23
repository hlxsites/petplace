import { ElementButton, FormSchema } from "~/components/design-system";

const COMMON_PROPS = {
  id: "form-playground",
  version: 0,
};

const SUBMIT_BUTTON: ElementButton = {
  elementType: "button",
  id: "submit-button",
  label: "Submit",
  type: "submit",
};

export const basicSchema: FormSchema = {
  ...COMMON_PROPS,
  children: [
    {
      elementType: "input",
      id: "name",
      label: "Required field",
      requiredCondition: true,
      type: "text",
    },
    {
      elementType: "input",
      id: "last-name",
      label: "Non required field",
      requiredCondition: false,
      type: "text",
    },
    SUBMIT_BUTTON,
  ],
};

export const fieldDependOnAnotherSchema: FormSchema = {
  ...COMMON_PROPS,
  children: [
    {
      elementType: "row",
      children: [
        {
          elementType: "input",
          id: "name",
          label: "Pet",
          requiredCondition: true,
          options: ["Bob", "Duda"],
          type: "select",
        },
        {
          disabledCondition: true,
          elementType: "input",
          id: "microchip",
          label: "Microchip",
          requiredCondition: true,
          shouldDisplay: {
            inputId: "name",
            type: "exists",
            value: "",
          },
          type: "text",
        },
      ],
    },
    SUBMIT_BUTTON,
  ],
};

export const repeaterSchema: FormSchema = {
  ...COMMON_PROPS,
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
    SUBMIT_BUTTON,
  ],
};
