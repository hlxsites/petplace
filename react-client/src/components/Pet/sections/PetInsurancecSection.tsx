import { Button, Card, Text } from "~/components/design-system";

export const PetInsuranceSection = () => {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center justify-items-center gap-large p-large md:items-start md:justify-items-start">
        <Text fontFamily="raleway" fontWeight="bold" size="lg">
          See pet's insurance in MyPetHealth
        </Text>

        <Button fullWidth={true} variant="secondary">
          View insurance details
        </Button>
      </div>
    </Card>
  );
};
