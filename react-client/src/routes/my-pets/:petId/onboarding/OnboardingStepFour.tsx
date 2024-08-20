import { ASSET_IMAGES } from "~/assets";
import { Button, IconKeys, Text, TextSpan } from "~/components/design-system";
import { DocumentationStatus } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "./components/OnboardingContent";
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepFour = ({ ...rest }: CommonOnboardingProps) => {
  if (rest.status === "none")
    return <NoneStatusContent {...rest} status="none" />;

  const contentProps = {
    ...rest,
    ...responseVariables(rest.status),
  };

  return {
    sent: <StepFourContent {...contentProps} />,
    approved: <StepFourContent {...contentProps} />,
    failed: <StepFourContent {...contentProps} />,
    "in progress": <StepFourContent {...contentProps} />,
  }[rest.status];

  function responseVariables(status: Exclude<DocumentationStatus, "none">) {
    type UploadVariables = Record<
      typeof status,
      {
        buttonDisabled?: boolean;
        iconClassName?: string;
        icon?: IconKeys;
        message: string;
        title: string;
      }
    >;

    return (
      {
        approved: {
          icon: "checkCircle",
          iconClassName: "bg-green-300 text-green-100",
          title: ONBOARDING_STEPS_TEXTS[4].approved.title,
          message: ONBOARDING_STEPS_TEXTS[4].approved.message,
        },
        failed: {
          icon: "clearCircle",
          iconClassName: "bg-red-300 text-red-100",
          title: ONBOARDING_STEPS_TEXTS[4].failed.title,
          message: ONBOARDING_STEPS_TEXTS[4].failed.message,
        },
        "in progress": {
          icon: "info",
          iconClassName: "bg-blue-300 text-blue-100",
          title: ONBOARDING_STEPS_TEXTS[4]["in progress"].title,
          message: ONBOARDING_STEPS_TEXTS[4]["in progress"].message,
        },
        sent: {
          buttonDisabled: true,
          title: ONBOARDING_STEPS_TEXTS[4].sent.title,
          message: ONBOARDING_STEPS_TEXTS[4].sent.message,
        },
      } satisfies UploadVariables
    )[status];
  }
};

const StepFourContent = ({
  buttonDisabled,
  onNextStep,
  ...rest
}: CommonOnboardingProps & {
  buttonDisabled?: boolean;
  iconClassName?: string;
  icon?: IconKeys;
  message: string;
  title: string;
}) => {
  return (
    <OnboardingContent
      footer={
        <OnboardingPrimaryButton disabled={buttonDisabled} onClick={onNextStep}>
          Next
        </OnboardingPrimaryButton>
      }
      preTitle
      {...rest}
    />
  );
};

const NoneStatusContent = ({
  name,
  updateStatus,
  ...props
}: CommonOnboardingProps) => {
  return (
    <OnboardingContent
      {...props}
      alignment={props.alignment}
      footer={renderUploadButtons()}
      title={ONBOARDING_STEPS_TEXTS[4].none.title}
    >
      <>
        <Text size="lg" align={props.alignment}>
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
        <TextSpan fontWeight="semibold" size="sm">
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
        <Button variant="secondary" onClick={props.onNextStep}>
          Not now
        </Button>
        <Button onClick={handleUpload}>Yes, upload documents</Button>
      </div>
    );
  }

  function handleUpload() {
    updateStatus("sent");

    setTimeout(() => {
      updateStatus("in progress");
    }, 1500);
  }
};
