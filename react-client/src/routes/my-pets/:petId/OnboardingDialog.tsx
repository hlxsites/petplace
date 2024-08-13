import { ASSET_IMAGES } from "~/assets";
import {
  Button,
  Dialog,
  StepProgress,
  Text,
  Title,
} from "~/components/design-system";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useWindowWidth } from "~/hooks/useWindowWidth";

const STEP_PARAM_KEY = "step";
const COUNT = 5;

export const OnboardingDialog = () => {
  const isSmallerScreen = useWindowWidth() < 768;

  const [parsedStep, setStep] = useLocalStorage(STEP_PARAM_KEY, 1);

  const step = parsedStep <= COUNT ? parsedStep : 1;
  const alignment = isSmallerScreen ? "center" : "left";

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      paddingNone
    >
      <div className="px-large pb-xxlarge pt-large md:p-xxxlarge">
        <div className={isSmallerScreen ? "max-w-max" : "max-w-[544px]"}>
          <StepProgress count={COUNT} current={step} />
          <div className="mb-large mt-xlarge flex text-center">
            <Title level="h2" align={alignment}>
              Welcome to PetPlace!
            </Title>
          </div>
          <Text size="lg" align={alignment}>
            Your go-to destination for keeping pets happy and healthy. Discover
            sound advice, trusted providers, and indispensable services all in
            one place.
          </Text>
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img src={ASSET_IMAGES.comfyDogAndCat} alt="Comfy dog and cat" />
          </div>
          <Button fullWidth onClick={handleClick}>
            Get Started
          </Button>
        </div>
      </div>
    </Dialog>
  );

  function handleClick() {
    const nextStep = step + 1;
    if (nextStep > COUNT) return;

    setStep(nextStep);
  }
};
