import { PetServices } from "~/domain/models/pet/PetModel";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { LinkButton, Text } from "../design-system";
import {
  ConfirmDialog,
  ConfirmDialogDetails,
} from "../design-system/dialog/ConfirmDialog";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetWatchServices } from "./PetWatchServices";

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
    isOpenModalType,
    onRenewMembership,
    onCloseConfirmDialog,
    petWatchBenefits: {
      petWatchAvailableBenefits,
      petWatchAnnualUnavailableBenefits,
    },
  } = usePetProfileContext();

  const resultDialog: ConfirmDialogDetails | null = (() => {
    if (isOpenModalType === "error") return ERROR_DETAILS;
    if (isOpenModalType === "success") return SUCCESS_DETAILS;
    return null;
  })();

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

  const contentDetails = getContentDetails(petWatchAvailableBenefits);

  const servicesElement = (() => {
    if (contentDetails) {
      return (
        <>
          <PetServiceDetailsCard
            {...contentDetails}
            isModalOpen={isOpenModalType === "renew"}
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
    void onRenewMembership();
  }
};
