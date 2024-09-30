import { Card, LinkButton, Title } from "~/components/design-system";

type PetInsuranceSectionProps = {
  petId: string;
};

export const PetInsuranceSection = ({ petId }: PetInsuranceSectionProps) => {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center justify-items-center gap-large p-large md:items-start md:justify-items-start">
        <Title level="h4">See pet's insurance in MyPetHealth</Title>

        <LinkButton
          fullWidth={true}
          openInNewTab={true}
          to={`https://mph-qay.pethealthinc.com/external/petplacelogin?redirecturl=petplace/policy?animalID=${petId}`}
          variant="secondary"
        >
          View insurance details
        </LinkButton>
      </div>
    </Card>
  );
};
