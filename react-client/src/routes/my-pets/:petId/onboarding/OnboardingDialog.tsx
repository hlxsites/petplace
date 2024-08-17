import { useState } from "react";
import { ASSET_IMAGES } from "~/assets";
import {
  Button,
  Dialog,
  Icon,
  IconKeys,
  Loading,
  StepProgress,
  Text,
  TextSpan,
  Title,
} from "~/components/design-system";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { DocumentationStatus, PetInfo } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "./OnboardingContent";
import { useOnboardingSteps } from "./useOnboardingSteps";

export const OnboardingDialog = ({ documentationStatus, name }: PetInfo) => {
  const isSmallerScreen = useWindowWidth() < 768;
  const { step, onNextStep, reset, totalSteps } = useOnboardingSteps();
  const [status, setStatus] = useState(documentationStatus ?? "none");

  const commonProps = {
    step,
    onNextStep,
  };

  const alignment = isSmallerScreen ? "center" : "left";

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      padding="p-0"
      width="fit-content"
    >
      <div
        className={classNames(
          "flex flex-col gap-xlarge px-large pb-xxlarge pt-xlarge md:p-xxxlarge",
          {
            "max-w-max": isSmallerScreen,
            "max-w-[640px]": !isSmallerScreen,
          }
        )}
      >
        <StepProgress count={totalSteps} current={step} />
        {renderContent()}
      </div>
    </Dialog>
  );

  function renderContent() {
    return {
      1: (
        <OnboardingContent
          {...commonProps}
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
      ),
      2: (
        <OnboardingContent
          {...commonProps}
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
      ),
      3: (
        <OnboardingContent
          {...commonProps}
          message="MyPets is where you keep track of all your pet's important stuff. Plus, recommendations on how to keep your pet protected!"
          title="It's all about your pet!"
        >
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img
              src={ASSET_IMAGES.friendlyDogAndCat}
              alt="Friendly dog and cat"
            />
          </div>
        </OnboardingContent>
      ),
      4: step4DynamicContent(),
      5: (
        <>
          {renderTitle("Almost there!")}
          {renderText(
            `Your pet's microchip is registered${status !== "none" ? " and adoption documents are digitally available" : ""}. Now let’s ensure your pet's safety with added layers of protection.`
          )}
          <div className="flex w-full justify-center">
            <div className="grid grid-rows-3 gap-[58px] md:grid-cols-3 md:grid-rows-1 md:py-xlarge">
              {renderStepsChoices({
                text: "Microchip registration",
                icon: "checkSolo",
                accepted: true,
                isFirst: true,
              })}
              {renderStepsChoices({
                text: "Digital documents",
                icon: "file",
                accepted: status !== "none",
              })}
              {renderStepsChoices({
                text: "Enhanced pet protection",
                icon: "shieldGood",
                accepted: false,
              })}
            </div>
          </div>
          {renderFinalActions()}
        </>
      ),
    }[step];
  }

  function step4DynamicContent() {
    return {
      none: (
        <OnboardingContent
          {...commonProps}
          hideButton
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

  function renderStepsChoices({
    icon,
    text,
    accepted = false,
    isFirst = false,
  }: {
    text: string;
    icon: IconKeys;
    accepted?: boolean;
    isFirst?: boolean;
  }) {
    return (
      <div className="relative flex items-center gap-[13px] md:flex-col">
        {!isFirst && (
          <div
            className={classNames(
              "absolute -top-[58px] left-[25px] h-[58px] w-0 border-2 md:-top-[48px] md:rotate-90",
              {
                "border-border-strong md:-left-[31px] md:h-[148px]": !accepted,
                "border-purple-300 md:-left-[32px] md:h-[147.25px]": accepted,
              }
            )}
          />
        )}
        <Icon
          display={accepted ? "checkSolo" : icon}
          className={classNames("rounded-full border p-base", {
            "border-2 text-purple-500": accepted,
          })}
          size={53}
        />
        <Text
          size="lg"
          color={accepted ? "purple-500" : "black"}
          fontWeight="medium"
          align={isSmallerScreen ? "left" : "center"}
        >
          {text}
        </Text>
      </div>
    );
  }

  function renderFinalActions() {
    return (
      <div className="flex flex-col-reverse items-stretch gap-base md:grid md:grid-cols-2">
        <Button variant="secondary" onClick={reset}>
          See my pet
        </Button>
        <Button onClick={reset}>See my options</Button>
      </div>
    );
  }

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

  function renderTitle(title: string) {
    return (
      <Title level="h2" align={alignment}>
        {title}
      </Title>
    );
  }

  function renderText(text: string) {
    return (
      <Text size="lg" align={alignment}>
        {text}
      </Text>
    );
  }
};
