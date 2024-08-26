import { Button, Card, Title } from "~/components/design-system";

export const PetInsuranceSection = () => {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center justify-items-center gap-large p-large md:items-start md:justify-items-start">
        <Title level="h4">See pet's insurance in MyPetHealth</Title>

        <Button fullWidth={true} variant="secondary">
          View insurance details
        </Button>
      </div>
    </Card>
  );
};
