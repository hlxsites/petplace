import { ASSET_IMAGES } from "~/assets";
import { Dialog, Icon, StepProgress } from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { classNames } from "~/util/styleUtil";
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
      <div
        className={classNames(
          "flex flex-col gap-xlarge px-large pb-xxlarge pt-xlarge md:p-xxxlarge",
          {
            "max-w-max": isSmallerScreen,
            "max-w-[640px]": !isSmallerScreen,
          }
        )}
      >
        <StepProgress count={totalSteps} current={step} />
        {renderContent()}
      </div>
    </Dialog>
  );

  function renderContent() {
    const commonProps = {
      step,
      onNextStep,
    };
    return {
      1: (
        <OnboardingContent
          {...commonProps}
          message="Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place."
          title="Welcome to PetPlace!"
        >
          <div className="flex w-full justify-center">
            <img
              className="w-full max-w-[430px]"
              alt="Comfy dog and cat"
              src={ASSET_IMAGES.comfyDogAndCat}
            />
          </div>
        </OnboardingContent>
      ),
      2: (
        <OnboardingContent
          {...commonProps}
          message="Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace."
          title="Important notice for 24Petwatch customers."
        >
          <div className="mb-xlarge mt-large flex flex-col items-center gap-base md:w-full md:flex-row md:justify-center">
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
        </OnboardingContent>
      ),
    }[step];
  }
};
