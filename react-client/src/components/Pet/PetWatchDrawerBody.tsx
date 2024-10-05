import { PetServices } from "~/domain/models/pet/PetModel";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { PetWatchServiceProps } from "~/routes/my-pets/petId/utils/petServiceDetails";
import { PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS } from "~/routes/my-pets/petId/utils/petWatchConstants";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { LinkButton, Text } from "../design-system";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetWatchServices } from "./PetWatchServices";

type PetWatchDrawerBodyProps = {
  contentDetails?: PetWatchServiceProps;
  onClick: (label?: string) => () => void;
  route?: string;
  serviceStatus: PetServices["membershipStatus"];
};

export const PetWatchDrawerBody = ({
  contentDetails,
  onClick,
  route,
  serviceStatus,
}: PetWatchDrawerBodyProps) => {
  const { petWatchBenefits } = usePetProfileContext();
  if (contentDetails) return <PetServiceDetailsCard {...contentDetails} />;

  const upgradeMembershipButton = (() => {
    if (!route) return null;
    return (
      <LinkButton fullWidth to={route} variant="primary">
        Upgrade membership
      </LinkButton>
    );
  })();

  const standardServiceDrawerElement = (() => {
    if (shouldRenderStandardServiceDrawer(serviceStatus)) {
      return upgradeMembershipButton;
    }
    return null;
  })();

  const annualServiceElement = (() => {
    if (serviceStatus !== "Annual member") return null;
    return renderAnnualService();
  })();

  return (
    <div className="grid gap-xlarge">
      <PetWatchServices
        onClick={onClick}
        petWatchBenefits={petWatchBenefits.petWatchAvailableBenefits}
      />

      {standardServiceDrawerElement}
      {annualServiceElement}
    </div>
  );

  function renderAnnualService() {
    return (
      <div className="grid gap-large">
        <Text color="tertiary-600">
          Upgrade your membership to unlock the following benefits:
        </Text>

        <div className="grid gap-small">
          {PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS.map(({ id, ...props }) => (
            <PetCardPetWatch key={id} onClick={onClick} {...props} />
          ))}
        </div>
        {upgradeMembershipButton}
      </div>
    );
  }
};
