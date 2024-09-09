import {
  Button,
  Card,
  DisplayForm,
  FormSchema,
  InputsUnion,
  Title,
} from "~/components/design-system";
import { CheckoutServicesDrawer } from "../CheckoutServicesDrawer";
import { useServicesDetails } from "../hooks/useServicesDetails";

export const OptInsSection = () => {
  const { items, goBack, openServiceDetails } = useServicesDetails();

  return (
    <>
      <Card>
        <div className="p-large">
          <Title level="h4">Opt-ins</Title>
          <div className="grid place-items-center gap-large pt-small lg:flex">
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
            <Button
              className="text-sm min-w-[90px] font-franklin text-orange-300-contrast"
              onClick={handleClick}
              variant="link"
            >
              More info
            </Button>
          </div>
        </div>
      </Card>
      <CheckoutServicesDrawer
        isOpen={!!items.length}
        onClose={goBack}
        services={items}
      />
    </>
  );

  function handleClick() {
    openServiceDetails();
  }
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
