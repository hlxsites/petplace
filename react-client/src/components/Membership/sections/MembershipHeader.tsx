import { ASSET_IMAGES } from "~/assets";
import { Text, Title } from "~/components/design-system";

type MemberShipHeaderProps = {
  petName: string;
};

export const MembershipHeader = ({ petName }: MemberShipHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-large lg:max-w-[900px]">
      <img alt="24 Pet Watch logo" src={ASSET_IMAGES.petWatchLogo} />
      <div className="grid gap-medium text-center">
        <Title
          level="h3"
          isResponsive
        >{`Choose a membership that's right for ${petName}`}</Title>
        <Text size="18">
          Unfortunately, 1 in 3 pets go missing. We know how stressful it can be
          when a furry family member is lost. With our lost pet memberships,
          we're here to help reunite lost pets with their families.
        </Text>
      </div>
    </div>
  );
};
