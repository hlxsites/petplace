import { useState } from "react";
import { Dialog, StepProgress } from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { DocumentationStatus, PetInfo } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";
import { OnboardingStepFive } from "./OnboardingStepFive";
import { OnboardingStepFour } from "./OnboardingStepFour";
import { OnboardingStepOne } from "./OnboardingStepOne";
import { OnboardingStepThree } from "./OnboardingStepThree";
import { OnboardingStepTwo } from "./OnboardingStepTwo";
import { useOnboardingSteps } from "./useOnboardingSteps";

export type CommonOnboardingProps = {
  alignment: "center" | "left";
  isSmallerScreen?: boolean;
  name: string;
  onNextStep: () => void;
  reset: () => void;
  updateStatus: (value: DocumentationStatus) => void;
  status: DocumentationStatus;
  step: number;
};

export const OnboardingDialog = ({ documentationStatus, name }: PetInfo) => {
  const isSmallerScreen = useWindowWidth() < 768;
  const { step, onNextStep, reset, totalSteps } = useOnboardingSteps();
  const [status, setStatus] = useState(documentationStatus ?? "none");

  const commonProps: CommonOnboardingProps = {
    alignment: isSmallerScreen ? "center" : "left",
    isSmallerScreen,
    name,
    onNextStep,
    reset,
    updateStatus,
    status,
    step,
  };

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
            "max-w-max": isSmallerScreen,
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
    return {
      1: <OnboardingStepOne {...commonProps} />,
      2: <OnboardingStepTwo {...commonProps} />,
      3: <OnboardingStepThree {...commonProps} />,
      4: <OnboardingStepFour {...commonProps} />,
      5: <OnboardingStepFive {...commonProps} />,
    }[step];
  }

  function updateStatus(value: DocumentationStatus) {
    setStatus(value);
  }
};
