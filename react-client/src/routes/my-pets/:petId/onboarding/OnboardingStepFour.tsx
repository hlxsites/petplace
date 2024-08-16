import { ASSET_IMAGES } from "~/assets";
import {
  Button,
  Icon,
  IconKeys,
  Loading,
  Text,
  TextSpan,
  Title,
} from "~/components/design-system";
import { DocumentationStatus } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

type StepFourContent = CommonOnboardingProps & {
  isSmallerScreen: boolean;
  name: string;
  status: DocumentationStatus;
  setStatus: (value: DocumentationStatus) => void;
};

export const OnboardingStepFour = ({
  status,
  ...props
}: StepFourContent) => {
  if (status === "none") return <NoneStatusContent {...props} status="none" />;

  const contentProps = {
    ...props,
    ...responseVariables(status),
  };

  return {
    sent: <StepFourContent {...contentProps} />,
    approved: <StepFourContent {...contentProps} />,
    failed: <StepFourContent {...contentProps} />,
    "in progress": <StepFourContent {...contentProps} />,
  }[status];

  function responseVariables(status: Exclude<DocumentationStatus, "none">) {
    type UploadVariables = Record<
      typeof status,
      {
        buttonDisabled?: boolean;
        className?: string;
        icon?: IconKeys;
        message: string;
        title: string;
      }
    >;

    return (
      {
        approved: {
          icon: "checkCircle",
          className: "bg-green-300 text-green-100",
          title: ONBOARDING_STEPS_TEXTS[4].approved.title,
          message: ONBOARDING_STEPS_TEXTS[4].approved.message,
        },
        failed: {
          icon: "clearCircle",
          className: "bg-red-300 text-red-100",
          title: ONBOARDING_STEPS_TEXTS[4].failed.title,
          message: ONBOARDING_STEPS_TEXTS[4].failed.message,
        },
        "in progress": {
          icon: "info",
          className: "bg-blue-300 text-blue-100",
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
  alignment,
  buttonDisabled,
  className,
  icon,
  message,
  onNextStep,
  title,
}: CommonOnboardingProps & {
  buttonDisabled?: boolean;
  className?: string;
  icon?: IconKeys;
  message: string;
  title: string;
}) => {
  return (
    <>
      <div className="flex w-full justify-center md:w-fit">
        {icon ? (
          <div
            className={classNames(
              "flex h-[64px] w-[64px] items-center justify-center rounded-full",
              className
            )}
          >
            <Icon display={icon} size={25} />
          </div>
        ) : (
          <Loading size={64} />
        )}
      </div>
      <Title align={alignment}>{title}</Title>
      <Text size="lg" align={alignment}>
        {message}
      </Text>
      <Button onClick={onNextStep} fullWidth disabled={buttonDisabled}>
        Next
      </Button>
    </>
  );
};

const NoneStatusContent = ({name, setStatus, ...props}: Exclude<StepFourContent, "status">) => {
  return (
    <OnboardingContent
      {...props}
      alignment={props.alignment}
      hideButton
      onNextStep={props.onNextStep}
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
        <ul className="flex flex-col items-center justify-center gap-xsmall md:flex-row">
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
        </ul>
        {renderUploadButtons()}
      </>
    </OnboardingContent>
  );

  function renderLI(text: string) {
    return (
      <li className="inline-block text-nowrap pl-0">
        <TextSpan fontWeight="semibold" size="sm">
          {text}
        </TextSpan>
      </li>
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
    setStatus("sent");

    setTimeout(() => {
      setStatus("in progress");
    }, 1500);
  }
};
