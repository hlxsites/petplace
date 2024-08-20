import { ASSET_IMAGES } from "~/assets";
import { Icon } from "~/components/design-system";
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepTwo = ({
  isSmallerScreen,
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
      message={ONBOARDING_STEPS_TEXTS[2].message}
      title={ONBOARDING_STEPS_TEXTS[2].title}
    >
      <div className="mb-xlarge mt-large flex flex-col items-center gap-base md:w-full md:flex-row md:justify-center">
        <img
          src={ASSET_IMAGES.petWatchLogo}
          alt={ONBOARDING_STEPS_TEXTS[2].imgAlt24Pet}
          className="w-[197px]"
        />
        <Icon
          display={
            isSmallerScreen ? "outlinedArrowBottom" : "outlinedArrowRight"
          }
          size={66}
        />
        <img
          src={ASSET_IMAGES.petPlaceLogo}
          alt={ONBOARDING_STEPS_TEXTS[2].imgAltPetPlace}
          className="w-[197px]"
        />
      </div>
    </OnboardingContent>
  );
};
