import { PetWatchServiceProps } from "~/routes/my-pets/petId/utils/petServiceDetails";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetServices } from "~/domain/models/pet/PetModel";
import { PetWatchServices } from "./PetWatchServices";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { LinkButton, Text } from "../design-system";
import { PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS } from "~/routes/my-pets/petId/utils/petWatchConstants";
import { PetCardPetWatch } from "./PetCardPetWatch";

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
  if (contentDetails) return <PetServiceDetailsCard {...contentDetails} />;

  return (
    <div className="grid gap-xlarge">
      <PetWatchServices onClick={onClick} serviceStatus={serviceStatus} />
      {shouldRenderStandardServiceDrawer(serviceStatus)
        ? route && (
            <LinkButton fullWidth to={route} variant="primary">
              Upgrade membership
            </LinkButton>
          )
        : null}
      {serviceStatus === "Annual member" && renderAnnualService()}
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
        {route && (
          <LinkButton fullWidth to={route} variant="primary">
            Upgrade membership
          </LinkButton>
        )}
      </div>
    );
  }
};
