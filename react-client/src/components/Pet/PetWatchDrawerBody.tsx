import { PetServices } from "~/domain/models/pet/PetModel";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { LinkButton, Text } from "../design-system";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetWatchServices } from "./PetWatchServices";

type PetWatchDrawerBodyProps = {
  route?: string;
  serviceStatus: PetServices["membershipStatus"];
};

export const PetWatchDrawerBody = ({
  route,
  serviceStatus,
}: PetWatchDrawerBodyProps) => {
  const {
    closeConfirmRenewModal,
    getContentDetails,
    handleContentChange,
    isConfirmRenewModalOpen,
    petWatchBenefits,
    onRenewMembership,
  } = usePetProfileContext();

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
      <SuspenseAwait resolve={petWatchBenefits}>
        {({ petWatchAvailableBenefits }) => {
          const contentDetails = getContentDetails(petWatchAvailableBenefits);

          if (contentDetails) {
            return (
              <PetServiceDetailsCard
                {...contentDetails}
                isModalOpen={isConfirmRenewModalOpen}
                onCloseModal={closeConfirmRenewModal}
                onConfirmModal={onRenewMembership}
              />
            );
          }

          return (
            <>
              <PetWatchServices
                onClick={handleContentChange}
                petWatchBenefits={petWatchAvailableBenefits}
              />
              {standardServiceDrawerElement}
              {annualServiceElement}
            </>
          );
        }}
      </SuspenseAwait>
    </div>
  );

  function renderAnnualService() {
    return (
      <div className="grid gap-large">
        <Text color="tertiary-600">
          Upgrade your membership to unlock the following benefits:
        </Text>

        <div className="grid gap-small">
          <SuspenseAwait resolve={petWatchBenefits}>
            {({ petWatchAnnualUnavailableBenefits }) =>
              petWatchAnnualUnavailableBenefits?.map(({ id, ...props }) => (
                <PetCardPetWatch
                  key={id}
                  onClick={handleContentChange}
                  {...props}
                />
              ))
            }
          </SuspenseAwait>
        </div>
        {upgradeMembershipButton}
      </div>
    );
  }
};
