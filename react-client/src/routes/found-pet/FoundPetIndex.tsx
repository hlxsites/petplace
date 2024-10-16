import {
  Card,
  DisplayUncontrolledForm,
  FormSchema,
} from "~/components/design-system";

const formSchema: FormSchema = {
  id: "lost-pet-form",
  children: [
    {
      elementType: "section",
      className: "!mb-xxxlarge",
      title: {
        label: "I have found a pet",
      },
      children: [
        {
          description:
            "Please do not include any spaces or special characters when entering the Pet Microchip or ID Number",
          elementType: "input",
          id: "microchip",
          label: "Pet microchip or ID number",
          requiredCondition: true,
          type: "text",
        },
      ],
    },
    {
      elementType: "section",
      title: {
        label: "Found location:",
      },
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
      title: {
        label: "Finder contact information:",
      },
      className: "!mb-xxxlarge",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              id: "finder-name",
              label: "Name",
              requiredCondition: true,
              type: "text",
            },
            {
              elementType: "input",
              id: "finder-phone",
              label: "Phone number",
              requiredCondition: true,
              type: "text",
            },
          ],
        },
        {
          elementType: "input",
          id: "finder-email",
          label: "Email address",
          requiredCondition: true,
          type: "email",
        },
        {
          elementType: "input",
          id: "additional-details",
          label:
            "Please include any additional detail that will help to reunite the lost pet with its owner. ",
          requiredCondition: true,
          type: "textarea",
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
          label: "Submit found pet",
          type: "submit",
        },
      ],
    },
  ],
  version: 0,
};

export const FoundPetIndex = () => {
  return (
    <div className="m-auto max-w-[800px]">
      <Card padding="xlarge">
        <DisplayUncontrolledForm
          onSubmit={({ values }) => {
            console.log("onSubmit values", values);
          }}
          schema={formSchema}
          variables={{
            stateOptions: [],
          }}
        />
      </Card>
    </div>
  );
};
