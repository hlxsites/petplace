import { PetServices } from "~/domain/models/pet/PetModel";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { Button, LinkButton, Text } from "../design-system";
import {
  ConfirmDialog,
  ConfirmDialogDetails,
} from "../design-system/dialog/ConfirmDialog";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetWatchServices } from "./PetWatchServices";
import { useState } from "react";

const ERROR_DETAILS: ConfirmDialogDetails = {
  confirmButtonLabel: "Check Payment Settings",
  message:
    "We were unable to renew your service. Please check your payment settings to ensure your information is up to date.",
  title: "Renewal Failed",
  type: "error",
};

const SUCCESS_DETAILS: ConfirmDialogDetails = {
  icon: "checkCircle",
  message: "Your service has been successfully renewed for another year.",
  title: "Renewal Successful",
  type: "success",
};

type PetWatchDrawerBodyProps = {
  isAnnualPlanExpired?: boolean;
  route?: string;
  serviceStatus: PetServices["membershipStatus"];
};

export const PetWatchDrawerBody = ({
  isAnnualPlanExpired,
  route,
  serviceStatus,
}: PetWatchDrawerBodyProps) => {
  const {
    closeConfirmRenewModal,
    getContentDetails,
    handleContentChange,
    isOpenModalType,
    isOpenSelectedBenefit,
    onRenewService,
    onCloseConfirmDialog,
    petWatchBenefits: {
      petWatchAvailableBenefits,
      petWatchAnnualUnavailableBenefits,
    },
  } = usePetProfileContext();
  const [isAnnualRenewModalOpen, setIsAnnualRenewModalOpen] = useState(false);

  const resultDialog: ConfirmDialogDetails | null = (() => {
    if (isOpenModalType === "error") return ERROR_DETAILS;
    if (isOpenModalType === "success") return SUCCESS_DETAILS;
    return null;
  })();

  const upgradeMembershipButton = (() => {
    if (!route) return null;
    return (
      <div className="grid gap-base">
        <LinkButton fullWidth to={route} variant="primary">
          Upgrade membership
        </LinkButton>
        {isAnnualPlanExpired && (
          <ConfirmDialog
            icon="info"
            isOpen={isAnnualRenewModalOpen}
            confirmButtonLabel="Confirm Renewal"
            message="Would you like to renew Annual Membership Plan for another year? This ensures continued protection for your pet's."
            onClickPrimaryButton={handleAnnualRenewal}
            onClose={() => setIsAnnualRenewModalOpen(false)}
            title="Confirm Renewal"
            trigger={
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setIsAnnualRenewModalOpen(true)}
              >
                Renew Annual Membership
              </Button>
            }
            type="info"
          />
        )}
      </div>
    );
  })();

  const standardServiceDrawerElement = (() => {
    if (shouldRenderStandardServiceDrawer(serviceStatus)) {
      return upgradeMembershipButton;
    }
    return null;
  })();

  const annualServiceElement = (() => {
    if (serviceStatus !== "Annual member" || isOpenSelectedBenefit) return null;
    return renderAnnualService();
  })();

  const contentDetails = getContentDetails(petWatchAvailableBenefits);

  const servicesElement = (() => {
    if (contentDetails) {
      return (
        <PetServiceDetailsCard
          {...contentDetails}
          isModalOpen={isOpenModalType === "renew"}
          onCloseModal={closeConfirmRenewModal}
          onConfirmModal={handleOnConfirmRenew}
        />
      );
    }

    return (
      <PetWatchServices
        onClick={handleContentChange}
        petWatchBenefits={petWatchAvailableBenefits}
      />
    );
  })();

  return (
    <div className="grid gap-xlarge">
      {servicesElement}
      {standardServiceDrawerElement}
      {annualServiceElement}
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
    </div>
  );

  function renderAnnualService() {
    return (
      <div className="grid gap-large">
        <Text color="tertiary-600">
          Upgrade your membership to unlock the following benefits:
        </Text>

        <div className="grid gap-small">
          {petWatchAnnualUnavailableBenefits?.map(({ id, ...props }) => (
            <PetCardPetWatch
              key={id}
              onClick={handleContentChange}
              {...props}
            />
          ))}
        </div>
        {upgradeMembershipButton}
      </div>
    );
  }

  function handleOnConfirmRenew() {
    void onRenewService();
  }

  function handleAnnualRenewal() {
    void onRenewService("annual");
    setIsAnnualRenewModalOpen(false);
  }
};
