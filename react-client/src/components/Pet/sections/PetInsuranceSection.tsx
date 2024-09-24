import { Card, LinkButton, Title } from "~/components/design-system";

export const PetInsuranceSection = () => {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center justify-items-center gap-large p-large md:items-start md:justify-items-start">
        <Title level="h4">See pet's insurance in MyPetHealth</Title>

        <LinkButton
          fullWidth={true}
          openInNewTab={true}
          to={"https://www.mypethealth.com/external/petplacelogin"}
          variant="secondary"
        >
          View insurance details
        </LinkButton>
      </div>
    </Card>
  );
};
