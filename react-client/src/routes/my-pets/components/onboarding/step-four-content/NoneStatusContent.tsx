import { ASSET_IMAGES } from "~/assets";
import { Button, Text, TextSpan } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "../components/OnboardingContent";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "../onboardingTexts";

type NoneStatusContentProps = CommonOnboardingProps & {
  name?: string;
  onSubmitConsent: (consent: boolean) => void;
};

export const NoneStatusContent = ({
  name,
  onSubmitConsent,
  ...props
}: NoneStatusContentProps) => {
  return (
    <OnboardingContent
      {...props}
      alignment={props.alignment}
      footer={renderUploadButtons()}
      title={ONBOARDING_STEPS_TEXTS[4].none.title}
    >
      <>
        <Text size="16" align={props.alignment}>
          {ONBOARDING_STEPS_TEXTS[4].none.message(name)[0]}
          <TextSpan fontWeight="semibold" display="inline">
            {ONBOARDING_STEPS_TEXTS[4].none.message(name)[1]}
          </TextSpan>
        </Text>
        <div className="flex w-full justify-center">
          <img
            src={
              props.isSmallerScreen
                ? ASSET_IMAGES.petServicesSm
                : ASSET_IMAGES.petServices
            }
            alt={ONBOARDING_STEPS_TEXTS[4].none.imgAlt}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-xsmall md:flex-row">
          <div className="flex items-center gap-xsmall">
            {renderLI("Microchip")}
            {renderSeparator()}
            {renderLI("Pet ID")}
            {renderSeparator()}
            {renderLI("Medical History")}
          </div>
          <div className="flex items-center gap-xsmall">
            {renderSeparator("hidden md:inline-block")}
            {renderLI("Insurance")}
            {renderSeparator()}
            {renderLI("Vaccines")}
            {renderSeparator()}
            {renderLI("Lost Pet Services")}
          </div>
        </div>
      </>
    </OnboardingContent>
  );

  function renderLI(text: string) {
    return (
      <div className="indivne-block text-nowrap pl-0">
        <TextSpan fontWeight="semibold" size="14">
          {text}
        </TextSpan>
      </div>
    );
  }

  function renderSeparator(customClass?: string) {
    return (
      <div
        className={classNames(
          "mt-[3px] inline-block h-2 w-2 rounded-full bg-orange-300-contrast",
          customClass
        )}
      />
    );
  }

  function renderUploadButtons() {
    return (
      <div className="flex flex-col-reverse items-stretch gap-base md:grid md:grid-cols-2">
        <Button variant="secondary" onClick={handleNotConsent}>
          Not now
        </Button>
        <Button onClick={handleConsent}>Yes, upload documents</Button>
      </div>
    );
  }

  function handleNotConsent() {
    onSubmitConsent(false);
    props.onNextStep();
  }

  function handleConsent() {
    onSubmitConsent(true);
  }
};
