import { ASSET_IMAGES } from "~/assets";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";

export const OnboardingStepThree = (props: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      {...props}
      message="MyPets is where you keep track of all your pet's important stuff. Plus, recommendations on how to keep your pet protected!"
      title="It's all about your pet!"
    >
      <div className="mb-xlarge mt-large flex w-full justify-center">
        <img src={ASSET_IMAGES.friendlyDogAndCat} alt="Friendly dog and cat" />
      </div>
    </OnboardingContent>
  );
};
