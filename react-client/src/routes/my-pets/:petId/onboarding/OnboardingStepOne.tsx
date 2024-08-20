import { ASSET_IMAGES } from "~/assets";
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepOne = ({
  onNextStep,
  ...rest
}: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      {...rest}
      footer={
        <OnboardingPrimaryButton onClick={onNextStep}>
          Get started
        </OnboardingPrimaryButton>
      }
      message={ONBOARDING_STEPS_TEXTS[1].message}
      title={ONBOARDING_STEPS_TEXTS[1].title}
    >
      <div className="flex w-full justify-center">
        <img
          className="w-full max-w-[430px]"
          alt={ONBOARDING_STEPS_TEXTS[1].imgAlt}
          src={ASSET_IMAGES.comfyDogAndCat}
        />
      </div>
    </OnboardingContent>
  );
};
