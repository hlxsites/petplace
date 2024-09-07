import { Card, DisplayForm, FormSchema } from "~/components/design-system";

export const AccountDetailsIndex = () => {
  const formSchema: FormSchema = {
    id: "account-details-form",
    children: [
      {
        elementType: "section",
        title: "Contact Info",
        className: "!mb-xxxlarge",
        children: [
          {
            elementType: "row",
            children: [
              {
                defaultSelect: "Home",
                disableSelect: true,
                description:
                  "You’re not required to own a ‘Home’ phone, however if it’s left blank, our system will auto-populate this field with your mobile or work number. This will not impact our ability to contact you if your pet is lost and found",
                elementType: "input",
                id: "phone-default",
                label: "Phone Number",
                requiredCondition: {
                  inputId: "phone-secondary",
                  type: "null",
                  value: "",
                },
                type: "phone",
              },
              {
                elementType: "input",
                id: "phone-secondary",
                label: "Phone Number 2",
                type: "phone",
              },
            ],
          },
        ],
      },
      {
        elementType: "section",
        title: "User details",
        children: [
          {
            elementType: "row",
            children: [
              {
                elementType: "input",
                id: "first-name",
                label: "First name",
                requiredCondition: true,
                type: "text",
              },
              {
                elementType: "input",
                id: "last-name",
                label: "Last name",
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
                id: "email-address",
                label: "Email address",
                requiredCondition: true,
                type: "text",
              },
            ],
          },
        ],
      },
      {
        elementType: "section",
        title: "Address",
        children: [
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
                placeholder: "State",
                type: "select",
              },
            ],
          },
          {
            elementType: "row",
            children: [
              {
                elementType: "input",
                id: "address-1",
                label: "Address Line 1",
                requiredCondition: true,
                type: "text",
              },
              {
                elementType: "input",
                id: "address-2",
                label: "Address Line 2",
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
                id: "city",
                label: "City",
                requiredCondition: true,
                type: "text",
              },
              {
                elementType: "input",
                id: "intersection-address",
                label: "Intersection/Address",
                requiredCondition: true,
                type: "text",
              },
            ],
          },
          {
            elementType: "row",
            className: "w-1/2",
            children: [
              {
                elementType: "input",
                id: "zip-code",
                label: "Zip Code",
                requiredCondition: true,
                type: "text",
              },
            ],
          },
        ],
      },
      {
        className: "!mt-xxlarge",
        elementType: "row",
        children: [
          {
            elementType: "button",
            id: "submit-button",
            label: "Save changes",
            type: "submit",
            disabledCondition: true,
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
            console.log("onChange values", props);
          }}
          onSubmit={({ event, values }) => {
            event.preventDefault();
            console.log("onSubmit values", values);
          }}
          schema={formSchema}
          variables={{
            countryOptions: ["Canada", "United States"],
            stateOptions: [],
          }}
        />
      </Card>
    </div>
  );
};
