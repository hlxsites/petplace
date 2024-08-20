import { ASSET_IMAGES } from "~/assets";
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepThree = ({
  onNextStep,
  ...rest
}: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      {...rest}
      footer={
        <OnboardingPrimaryButton onClick={onNextStep}>
          Next
        </OnboardingPrimaryButton>
      }
      message={ONBOARDING_STEPS_TEXTS[3].message}
      title={ONBOARDING_STEPS_TEXTS[3].title}
    >
      <div className="mb-xlarge mt-large flex w-full justify-center">
        <img
          src={ASSET_IMAGES.friendlyDogAndCat}
          alt={ONBOARDING_STEPS_TEXTS[3].imgAlt}
        />
      </div>
    </OnboardingContent>
  );
};
