import { Dialog, StepProgress } from "~/components/design-system";
import { DocumentationStatus, PetCommon } from "~/domain/models/pet/PetModel";
import { useLocalStorageSteps } from "~/hooks/useLocalStorageSteps";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { classNames } from "~/util/styleUtil";
import { OnboardingStepFive } from "./OnboardingStepFive";
import { OnboardingStepOne } from "./OnboardingStepOne";
import { OnboardingStepThree } from "./OnboardingStepThree";
import { OnboardingStepTwo } from "./OnboardingStepTwo";
import { OnboardingStepFour } from "./step-four-content/OnboardingStepFour";

const STEP_PARAM_KEY = "onboarding-step";
const TOTAL_STEPS = 5;

export type CommonOnboardingProps = {
  alignment: "center" | "left";
  isSmallerScreen?: boolean;
  onNextStep: () => void;
  step: number;
};

type OnboardingDialogProps = {
  onFinish: () => void;
  onSubmitConsent: (consent: boolean) => void;
  status: DocumentationStatus;
  pet: Pick<PetCommon, "name"> | null;
};

export const OnboardingDialog = ({
  onFinish,
  pet,
  onSubmitConsent,
  status,
}: OnboardingDialogProps) => {
  const isSmallerScreen = useWindowWidth() < 768;

  const {
    currentStep: step,
    onNextStep,
    reset,
  } = useLocalStorageSteps({
    key: STEP_PARAM_KEY,
    totalSteps: TOTAL_STEPS,
  });

  const handleOnFinish = () => {
    onFinish();

    setTimeout(() => {
      // Reset the steps on local storage
      reset();
    }, 500);
  };

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      padding="p-0"
      trigger={undefined}
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
        <StepProgress count={TOTAL_STEPS} current={step} />
        {renderContent()}
      </div>
    </Dialog>
  );

  function renderContent() {
    const commonProps: CommonOnboardingProps = {
      alignment: isSmallerScreen ? "center" : "left",
      isSmallerScreen,
      onNextStep,
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
        return (
          <OnboardingStepFour
            {...commonProps}
            name={pet?.name}
            onSubmitConsent={onSubmitConsent}
            status={status}
          />
        );
      case 5:
      default:
        return (
          <OnboardingStepFive {...commonProps} onFinish={handleOnFinish} />
        );
    }
  }
};
