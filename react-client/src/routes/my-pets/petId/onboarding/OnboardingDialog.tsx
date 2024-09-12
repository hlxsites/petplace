import { useEffect, useState } from "react";
import { Dialog, StepProgress } from "~/components/design-system";
import { DocumentationStatus, PetModel } from "~/domain/models/pet/PetModel";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { classNames } from "~/util/styleUtil";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";
import { OnboardingStepFive } from "./OnboardingStepFive";
import { OnboardingStepOne } from "./OnboardingStepOne";
import { OnboardingStepThree } from "./OnboardingStepThree";
import { OnboardingStepTwo } from "./OnboardingStepTwo";
import { OnboardingStepFour } from "./step-four-content/OnboardingStepFour";
import { useOnboardingSteps } from "./useOnboardingSteps";

export type CommonOnboardingProps = {
  alignment: "center" | "left";
  isSmallerScreen?: boolean;
  onNextStep: () => void;
  reset: () => void;
  setStatus: (value: DocumentationStatus) => void;
  status: DocumentationStatus;
  step: number;
};

export const OnboardingDialog = () => {
  const isSmallerScreen = useWindowWidth() < 768;
  const viewModel = usePetProfileContext();

  const [petInfo, setPetInfo] = useState<PetModel | null>(null);
  const [status, setStatus] = useState<DocumentationStatus>("none");

  const { step, onNextStep, reset, totalSteps } = useOnboardingSteps();

  useEffect(() => {
    const resolvePetInfo = async () => {
      try {
        const resolvedPetInfo = await viewModel.petInfo;
        setPetInfo(resolvedPetInfo);
        setStatus(resolvedPetInfo?.documentationStatus ?? "none");
      } catch (error) {
        console.error("Failed to resolve petInfo:", error);
      }
    };

    // Ensure the promise is handled, and the lint rule is satisfied
    void resolvePetInfo();
  }, [viewModel.petInfo]);

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      padding="p-0"
      width="fit-content"
    >
      <div
        className={classNames(
          "flex flex-col gap-xlarge px-large pb-xxlarge pt-xlarge md:p-xxxlarge",
          {
            "max-w-full": isSmallerScreen,
            "max-w-[640px]": !isSmallerScreen,
          }
        )}
      >
        <StepProgress count={totalSteps} current={step} />
        {renderContent()}
      </div>
    </Dialog>
  );

  function renderContent() {
    const commonProps: CommonOnboardingProps = {
      alignment: isSmallerScreen ? "center" : "left",
      isSmallerScreen,
      onNextStep,
      reset,
      setStatus,
      status,
      step,
    };

    switch (step) {
      case 1:
        return <OnboardingStepOne {...commonProps} />;
      case 2:
        return <OnboardingStepTwo {...commonProps} />;
      case 3:
        return <OnboardingStepThree {...commonProps} />;
      case 4:
        return <OnboardingStepFour {...commonProps} name={petInfo?.name} />;
      case 5:
      default:
        return <OnboardingStepFive {...commonProps} />;
    }
  }
};
