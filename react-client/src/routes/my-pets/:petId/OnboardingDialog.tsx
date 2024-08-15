import { useState } from "react";
import { Dialog, StepProgress } from "~/components/design-system";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { PetInfo } from "~/mocks/MockRestApiServer";
import { OnboardingContent } from "./OnboardingContent";

const STEP_PARAM_KEY = "step";
const COUNT = 5;

export const OnboardingDialog = (props: PetInfo) => {
  const isSmallerScreen = useWindowWidth() < 768;
  const [parsedStep, setStep] = useLocalStorage(STEP_PARAM_KEY, 1);
  const [isOpen, setIsOpen] = useState(true);

  const step = parsedStep <= COUNT ? parsedStep : 1;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      isLocked
      paddingNone
      widthFit
    >
      {({ onCloseWithAnimation }) => (
        <div className="px-large pb-xxlarge pt-large md:p-xxxlarge">
          <div className={isSmallerScreen ? "max-w-max" : "max-w-[544px]"}>
            <StepProgress count={COUNT} current={step} />
            <OnboardingContent
              isSmallerScreen={isSmallerScreen}
              moveToNextStep={moveToNextStep}
              onCloseWithAnimation={onCloseWithAnimation}
              step={step}
              {...props}
            />
          </div>
        </div>
      )}
    </Dialog>
  );

  function moveToNextStep() {
    const nextStep = step + 1;
    if (nextStep > COUNT) return;

    setStep(nextStep);
  }

  function handleClose() {
    setIsOpen(false);
  }
};
