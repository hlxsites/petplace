import { ASSET_IMAGES } from "~/assets";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";

export const OnboardingStepOne = (props: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      {...props}
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
  );
};
