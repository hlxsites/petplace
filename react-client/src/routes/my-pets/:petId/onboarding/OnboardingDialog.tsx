import { ASSET_IMAGES } from "~/assets";
import { Dialog, Icon, StepProgress } from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { OnboardingContent } from "./OnboardingContent";
import { useOnboardingSteps } from "./useOnboardingSteps";

export const OnboardingDialog = () => {
  const isSmallerScreen = useWindowWidth() < 768;
  const { step, onNextStep, totalSteps } = useOnboardingSteps();

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      padding="p-0"
      width="fit-content"
    >
      <div className="px-large pb-xxlarge pt-large md:p-xxxlarge">
        <div className={isSmallerScreen ? "max-w-max" : "max-w-[544px]"}>
          <StepProgress count={totalSteps} current={step} />
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );

  function renderContent() {
    return {
      1: (
        <OnboardingContent
          ariaLable="welcome-step"
          mainContent={
            <div className="mb-xlarge mt-large flex w-full justify-center">
              <img src={ASSET_IMAGES.comfyDogAndCat} alt="Comfy dog and cat" />
            </div>
          }
          message="Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place."
          onNextStep={onNextStep}
          step={step}
          title="Welcome to PetPlace!"
        />
      ),
      2: (
        <OnboardingContent
          ariaLable="step-2"
          message="Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace."
          mainContent={
            <div className="mb-xlarge mt-large flex flex-col items-center gap-base md:w-full md:flex-row md:justify-center md:py-xxlarge">
              <img
                src={ASSET_IMAGES.petWatchLogo}
                alt="24 Pet Watch Logo"
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
                alt="Pet Place Logo"
                className="w-[197px]"
              />
            </div>
          }
          onNextStep={onNextStep}
          step={step}
          title="Important notice for 24Petwatch customers."
        />
      ),
    }[step];
  }
};
