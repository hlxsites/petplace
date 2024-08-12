import { useSearchParams } from "react-router-dom";
import { ASSET_IMAGES } from "~/assets";
import {
  Button,
  Dialog,
  StepProgress,
  Text,
  Title,
} from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";

const ONBOARDING_PARAM = "is-onboarding";
const STEP_PARAM = "step";
const COUNT = 5;

export const OnboardingDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOnboarding = searchParams.get(ONBOARDING_PARAM);
  if (!isOnboarding) return null;

  const parsedParam = Number(searchParams.get(STEP_PARAM));
  const step = parsedParam > 0 && parsedParam <= COUNT ? parsedParam : 1;

  const isSmallerScreen = useWindowWidth() < 768;
  const alignment = isSmallerScreen ? "center" : "left";

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      padding="px-large pt-large pb-xxlarge md:p-xxxlarge"
    >
      <StepProgress count={COUNT} current={step} />
      <div className="mb-large mt-xlarge flex text-center">
        <Title level="h2" align={alignment}>
          Welcome to PetPlace!
        </Title>
      </div>
      <Text size="lg" align={alignment}>
        Your go-to destination for keeping pets happy and healthy. Discover
        sound advice, trusted providers, and indispensable services all in one
        place.
      </Text>
      <div className="mb-xlarge mt-large flex w-full justify-center">
        <img src={ASSET_IMAGES.comfyDogAndCat} alt="Comfy dog and cat" />
      </div>
      <Button onClick={handleClick}>Get Started</Button>
    </Dialog>
  );

  function handleClick() {
    const nextStep = step + 1;
    if (nextStep > COUNT) return;

    searchParams.set(STEP_PARAM, String(step + 1));
    setSearchParams(searchParams);
  }
};
