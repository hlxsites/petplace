import { OnboardingContent } from "../components/OnboardingContent";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { OnboardingPrimaryButton } from "../components/OnboardingPrimaryButton";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "../onboardingTexts";

export const InProgressStatusContent = ({
  onNextStep,
  ...rest
}: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      footer={
        <OnboardingPrimaryButton onClick={onNextStep}>
          Next
        </OnboardingPrimaryButton>
      }
      header={
        <OnboardingIcon
          className="bg-blue-300 text-blue-100"
          display="info"
        />
      }
      title={ONBOARDING_STEPS_TEXTS[4].inProgress.title}
      message={ONBOARDING_STEPS_TEXTS[4].inProgress.message}
      {...rest}
    />
  );
};
