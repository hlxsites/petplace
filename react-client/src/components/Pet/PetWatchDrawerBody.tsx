import { PetServices } from "~/domain/models/pet/PetModel";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { LinkButton, Text } from "../design-system";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetWatchServices } from "./PetWatchServices";
import {
  ConfirmDialog,
  ConfirmDialogDetails,
} from "../design-system/dialog/ConfirmDialog";
import { useRenewMembershipViewModel } from "~/routes/my-pets/petId/useRenewMembershipViewModel";
import { useState } from "react";

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
  } = useRenewMembershipViewModel();

  const [resultDialog, setResultDialog] = useState<ConfirmDialogDetails | null>(
    null
  );

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

  function handleOnConfirmRenew() {
    void onRenewMembership().then((result) => {
      closeConfirmRenewModal();
      setResultDialog(result);
    });
  }

  function onCloseConfirmDialog() {
    setResultDialog(null);
  }

  return (
    <div className="grid gap-xlarge">
      <SuspenseAwait resolve={petWatchBenefits}>
        {({ petWatchAvailableBenefits }) => {
          const contentDetails = getContentDetails(petWatchAvailableBenefits);

          if (contentDetails) {
            return (
              <>
                <PetServiceDetailsCard
                  {...contentDetails}
                  isModalOpen={isConfirmRenewModalOpen}
                  onCloseModal={closeConfirmRenewModal}
                  onConfirmModal={handleOnConfirmRenew}
                />
                {resultDialog && (
                  <ConfirmDialog
                    icon={resultDialog.icon}
                    isOpen={true}
                    onClose={onCloseConfirmDialog}
                    confirmButtonLabel={resultDialog.confirmButtonLabel}
                    message={resultDialog.message}
                    title={resultDialog.title}
                    type={resultDialog.type}
                  />
                )}
              </>
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
