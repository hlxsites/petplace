import { FormSchema, InputsUnion, Text } from "~/components/design-system";
import { disableInput } from "~/components/design-system/form/utils/formInputUtils";

export const petInfoIds = {
  age: "age",
  breed: "breed",
  dateOfBirth: "dob",
  insurance: "insurance",
  microchip: "microchip",
  mixedBreed: "mixedBreed",
  name: "name",
  neuteredSpayed: "neuteredSpayed",
  petId: "id",
  sex: "sex",
  species: "species",
};

const petNameInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.name,
  label: "Pet name",
  errorMessage: "Please enter your pet's name.",
  requiredCondition: true,
  type: "text",
};

const speciesInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.species,
  label: "Species",
  options: ["Dog", "Cat"],
  requiredCondition: true,
  type: "select",
};

const sexInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.sex,
  label: "Sex",
  options: ["Female", "Male"],
  requiredCondition: true,
  type: "select",
};

const breedInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.breed,
  label: "Breed",
  options: "{{breedOptions|string[]}}",
  optionsType: "dynamic",
  type: "select",
};

const mixedBreedInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.mixedBreed,
  label: "Mixed Breed",
  options: ["Yes", "No"],
  optionsType: "static",
  requiredCondition: true,
  type: "select",
};

const ageInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.age,
  label: "Age",
  requiredCondition: true,
  disabledCondition: true,
  type: "text",
};

const dobInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.dateOfBirth,
  label: "Date of birth",
  requiredCondition: true,
  type: "text",
};

const microchipInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.microchip,
  label: "Microchip #",
  requiredCondition: true,
  type: "number",
};

const insuranceInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.insurance,
  label: "Insurance #",
  requiredCondition: true,
  type: "text",
};

const neuteredSpayedInput: InputsUnion = {
  elementType: "input",
  id: petInfoIds.neuteredSpayed,
  label: "Spayed/Neutered",
  options: ["Yes", "No"],
  optionsType: "static",
  requiredCondition: true,
  type: "select",
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

export const editPetProfileFormSchema: (hasPolicy: boolean) => FormSchema = (
  hasPolicy
) => ({
  id: "edit-pet-profile-form",
  children: [
    {
      elementType: "row",
      children: [
        { ...petNameInput, label: "Name" },
        disableInput(speciesInput, hasPolicy),
      ],
    },
    {
      elementType: "row",
      children: [
        disableInput(
          {
            ...breedInput,
            requiredCondition: true,
          },
          hasPolicy
        ),
        disableInput(mixedBreedInput, hasPolicy),
      ],
    },
    {
      elementType: "row",
      children: [
        { ...dobInput, disabledCondition: true },
        { ...ageInput, disabledCondition: true },
      ],
    },
    {
      elementType: "row",
      children: [
        { ...sexInput, disabledCondition: true },
        { ...neuteredSpayedInput, disabledCondition: true },
      ],
    },
    {
      elementType: "row",
      children: [
        { ...microchipInput, disabledCondition: true },
        { ...insuranceInput, disabledCondition: true },
      ],
    },
    {
      className: "!mt-xxlarge h-[100px] lg:h-[42px]",
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
});
