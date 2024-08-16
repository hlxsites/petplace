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

export const OnboardingStepFour = ({
  alignment,
  isSmallerScreen,
  name,
  onNextStep,
  status,
  setStatus,
  ...props
}: CommonOnboardingProps & {
  isSmallerScreen: boolean;
  name: string;
  status: string;
  setStatus: (value: DocumentationStatus) => void;
}) => {
  return {
    none: (
      <OnboardingContent
        {...props}
        alignment={alignment}
        hideButton
        onNextStep={onNextStep}
        title="At PetPlace you can access all your pet's adoption documents."
      >
        <>
          <Text size="lg" align={alignment}>
            Update, add files, download, or print. It's the one place to keep
            all your pet's details.{" "}
            <TextSpan fontWeight="semibold" display="inline">
              {`If available, would you like PetPlace to access and upload ${name}'s shelter documents for you?`}
            </TextSpan>
          </Text>
          <div className="flex w-full justify-center">
            <img
              src={
                isSmallerScreen
                  ? ASSET_IMAGES.petServicesSm
                  : ASSET_IMAGES.petServices
              }
              alt="Icons representing available pet services"
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
    ),
    sent: (
      <>
        <div className="flex w-full justify-center md:w-fit">
          <Loading size={64} />
        </div>
        <Title align={alignment} level="h2">
          Uploading...
        </Title>
        {renderText(
          "Your pet’s documents are being processed. Please wait a moment while we complete the upload."
        )}
        <Button className="text-neutral-500" fullWidth disabled>
          Next
        </Button>
      </>
    ),
    approved: renderUploadResponse("approved"),
    failed: renderUploadResponse("failed"),
    "in progress": renderUploadResponse("in progress"),
  }[status];

  function renderUploadResponse(
    status: Exclude<DocumentationStatus, "none" | "sent">
  ) {
    const { icon, className, title, description } = responseVariables(status);

    return (
      <>
        <div className="flex w-full justify-center md:w-fit">
          <div
            className={classNames(
              "flex h-[64px] w-[64px] items-center justify-center rounded-full",
              className
            )}
          >
            <Icon display={icon} size={25} />
          </div>
        </div>
        <Title align={alignment}>{title}</Title>
        <Text size="lg" align={alignment}>
          {description}
        </Text>
        <Button onClick={onNextStep} fullWidth>
          Next
        </Button>
      </>
    );
  }

  function responseVariables(
    status: Exclude<DocumentationStatus, "none" | "sent">
  ) {
    type UploadVariables = Record<
      typeof status,
      { className: string; description: string; icon: IconKeys; title: string }
    >;

    return (
      {
        approved: {
          icon: "checkCircle",
          className: "bg-green-300 text-green-100",
          title: "Upload Successful!",
          description:
            "Your pet’s documents have been uploaded successfully and are now available.",
        },
        failed: {
          icon: "clearCircle",
          className: "bg-red-300 text-red-100",
          title: "Upload Failed",
          description:
            "There was an issue uploading your pet’s documents. Please try again or upload them manually.",
        },
        "in progress": {
          icon: "info",
          className: "bg-blue-300 text-blue-100",
          title: "Upload In Progress",
          description:
            "Your pet’s documents are being uploaded. They will be available within 24 hours.",
        },
      } satisfies UploadVariables
    )[status];
  }

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

  function renderText(text: string) {
    return (
      <Text size="lg" align={alignment}>
        {text}
      </Text>
    );
  }

  function renderUploadButtons() {
    return (
      <div className="flex flex-col-reverse items-stretch gap-base md:grid md:grid-cols-2">
        <Button variant="secondary" onClick={onNextStep}>
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
