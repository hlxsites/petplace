import { OnboardingContent } from "../components/OnboardingContent";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { OnboardingPrimaryButton } from "../components/OnboardingPrimaryButton";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "../onboardingTexts";

export const ApprovedStatusContent = ({
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
          className="bg-green-300 text-green-100"
          display="checkCircle"
        />
      }
      title={ONBOARDING_STEPS_TEXTS[4].approved.title}
      message={ONBOARDING_STEPS_TEXTS[4].approved.message}
      {...rest}
    />
  );
};
