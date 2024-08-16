import { ASSET_IMAGES } from "~/assets";
import { Icon } from "~/components/design-system";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";

export const OnboardingStepTwo = ({
  isSmallerScreen,
  ...props
}: CommonOnboardingProps & { isSmallerScreen: boolean }) => {
  return (
    <OnboardingContent
      {...props}
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
  );
};
