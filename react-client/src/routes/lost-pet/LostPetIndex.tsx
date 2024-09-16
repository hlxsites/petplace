import { Card, DisplayForm, FormSchema } from "~/components/design-system";
import { useLostPetIndexViewModel } from "./useLostPetIndexViewModel";

export const LostPetIndex = () => {
  const { onSelectPet, pets, selectedPet } = useLostPetIndexViewModel();

  const formSchema: FormSchema = {
    id: "lost-pet-form",
    children: [
      {
        elementType: "section",
        className: "!mb-xxxlarge",
        title: "I have lost a pet",
        description:
          "We're sorry to hear that, please confirm the information below:",
        children: [
          {
            elementType: "input",
            id: "name",
            label: "Pet name",
            requiredCondition: true,
            options: "{{petOptions|string[]}}",
            optionsType: "dynamic",
            type: "select",
          },
          {
            elementType: "input",
            id: "microchip",
            label: "Pet microchip or ID number",
            disabledCondition: true,
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
      {
        elementType: "section",
        title: "Last seen:",
        className: "!mb-xxxlarge",
        children: [
          {
            elementType: "row",
            children: [
              {
                elementType: "input",
                id: "address",
                label: "Intersection/Address",
                requiredCondition: true,
                type: "text",
              },
              {
                elementType: "input",
                id: "city",
                label: "City",
                requiredCondition: true,
                type: "text",
              },
            ],
          },
          {
            elementType: "row",
            children: [
              {
                elementType: "input",
                id: "country",
                label: "Country",
                requiredCondition: true,
                options: "{{countryOptions|string[]}}",
                optionsType: "dynamic",
                type: "select",
              },
              {
                elementType: "input",
                id: "state",
                label: "Province/State",
                requiredCondition: true,
                options: "{{stateOptions|string[]}}",
                optionsType: "dynamic",
                type: "select",
              },
            ],
          },
        ],
      },
      {
        elementType: "section",
        title: "Owner details:",
        className: "!mb-xxxlarge",
        children: [
          {
            elementType: "row",
            children: [
              {
                elementType: "input",
                id: "owner-name",
                label: "Name",
                disabledCondition: true,
                requiredCondition: true,
                type: "text",
              },
              {
                elementType: "input",
                id: "owner-phone",
                label: "Phone number",
                requiredCondition: true,
                type: "text",
              },
            ],
          },
          {
            elementType: "input",
            id: "owner-email",
            label: "Email address",
            requiredCondition: true,
            type: "email",
          },
        ],
      },
      {
        className: "!mt-xxlarge",
        elementType: "row",
        children: [
          {
            elementType: "button",
            id: "cancel-button",
            label: "Cancel",
            type: "reset",
          },
          {
            elementType: "button",
            id: "submit-button",
            label: "Submit lost pet",
            type: "submit",
          },
        ],
      },
    ],
    version: 0,
  };

  return (
    <div className="m-auto max-w-[800px]">
      <Card padding="xlarge">
        <DisplayForm
          onChange={(props) => {
            if (props.name) {
              onSelectPet(props.name as string);
            }
          }}
          onSubmit={({ event, values }) => {
            event.preventDefault();
            console.log("onSubmit values", values);
          }}
          schema={formSchema}
          variables={{
            countryOptions: ["Canada", "United States"],
            petOptions: pets.map((pet) => pet.name),
            stateOptions: [],
          }}
          values={{
            microchip: selectedPet?.microchipNumber?.toString() ?? "",
          }}
        />
      </Card>
    </div>
  );
};
