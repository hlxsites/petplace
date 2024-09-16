import {
  Card,
  DisplayForm,
  FormSchema,
  InputsUnion,
  LinkButton,
  Title,
} from "~/components/design-system";

export const OptInsSection = () => {
  return (
    <Card>
      <div className="p-large">
        <Title level="h4">Opt-ins</Title>
        <div className="flex gap-large">
          <DisplayForm
            onChange={(props) => {
              console.log("onChange values", props);
            }}
            onSubmit={({ event, values }) => {
              event.preventDefault();
              console.log("onSubmit values", values);
            }}
            schema={optInFormSchema}
          />
          {/* Need to define the route for opt-in */}
          <LinkButton
            className="font-franklin text-sm text-orange-300-contrast"
            to={""}
          >
            More info
          </LinkButton>
        </div>
      </div>
    </Card>
  );
};

const optInInput: InputsUnion = {
  elementType: "input",
  hideLabel: true,
  id: "optIn",
  label: "Consent to opt-in",
  options: [
    "To continue accessing 24PetMedAlert® and 24/7 Vet Helpline beyond your complimentary first year, click here to opt-in to auto-renew these services for only $19.95/year (plus applicable taxes). Price subject to change.",
  ],
  requiredCondition: true,
  type: "checkboxGroup",
};

const optInFormSchema: FormSchema = {
  id: "opt-in-form",
  children: [
    {
      ...optInInput,
    },
  ],
  version: 0,
};
