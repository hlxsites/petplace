import { OnboardingContent } from "../components/OnboardingContent";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { OnboardingPrimaryButton } from "../components/OnboardingPrimaryButton";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "../onboardingTexts";

export const FailedStatusContent = ({
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
          className="bg-red-300 text-red-100"
          display="clearCircle"
        />
      }
      title={ONBOARDING_STEPS_TEXTS[4].failed.title}
      message={ONBOARDING_STEPS_TEXTS[4].failed.message}
      {...rest}
    />
  );
};
