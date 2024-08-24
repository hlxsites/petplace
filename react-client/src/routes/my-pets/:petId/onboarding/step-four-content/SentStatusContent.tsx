import { Loading } from "~/components/design-system";
import { OnboardingContent } from "../components/OnboardingContent";
import { OnboardingPrimaryButton } from "../components/OnboardingPrimaryButton";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "../onboardingTexts";

export const SentStatusContent = ({
  onNextStep,
  ...rest
}: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      footer={
        <OnboardingPrimaryButton disabled onClick={onNextStep}>
          Next
        </OnboardingPrimaryButton>
      }
      header={
        <Loading />
      }
      title={ONBOARDING_STEPS_TEXTS[4].sent.title}
      message={ONBOARDING_STEPS_TEXTS[4].sent.message}
      {...rest}
    />
  );
};
