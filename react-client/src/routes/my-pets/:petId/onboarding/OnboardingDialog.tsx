import { ASSET_IMAGES } from "~/assets";
import {
  Button,
  Dialog,
  Icon,
  StepProgress,
  Text,
  Title,
} from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { useOnboardingSteps } from "./useOnboardingSteps";

export const OnboardingDialog = () => {
  const isSmallerScreen = useWindowWidth() < 768;
  const { step, onNextStep, totalSteps } = useOnboardingSteps();

  const alignment = isSmallerScreen ? "center" : "left";

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      paddingNone
      widthFit
    >
      <div className="px-large pb-xxlarge pt-large md:p-xxxlarge">
        <div className={isSmallerScreen ? "max-w-max" : "max-w-[544px]"}>
          <StepProgress count={totalSteps} current={step} />
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );

  function renderActionButtons() {
    const label = step < 2 ? "Get Started" : "Next";
    return (
      <Button onClick={onNextStep} fullWidth>
        {label}
      </Button>
    );
  }

  function renderTitle(title: string) {
    return (
      <div className="mb-large mt-xlarge flex text-center">
        <Title level="h2" align={alignment}>
          {title}
        </Title>
      </div>
    );
  }

  function renderText(text: string) {
    return (
      <Text size="lg" align={alignment}>
        {text}
      </Text>
    );
  }

  function renderContent() {
    return {
      1: (
        <div key={"welcome-step"}>
          {renderTitle("Welcome to PetPlace!")}
          {renderText(
            "Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place."
          )}
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img src={ASSET_IMAGES.comfyDogAndCat} alt="Comfy dog and cat" />
          </div>
          {renderActionButtons()}
        </div>
      ),
      2: (
        <div key={"step-2"}>
          {renderTitle("Important notice for 24Petwatch customers.")}
          {renderText(
            "Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace."
          )}
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
          {renderActionButtons()}
        </div>
      ),
    }[step];
  }
};
