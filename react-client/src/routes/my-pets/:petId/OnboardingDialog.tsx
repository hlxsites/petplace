import { useEffect, useState } from "react";
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
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { DocumentationStatus, PetInfo } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";

const STEP_PARAM_KEY = "step";
const COUNT = 5;

export const OnboardingDialog = ({ documentationStatus, name }: PetInfo) => {
  const isSmallerScreen = useWindowWidth() < 768;

  const [parsedStep, setStep] = useLocalStorage(STEP_PARAM_KEY, 1);
  const [status, setStatus] = useState(documentationStatus ?? "none");

  const step = parsedStep <= COUNT ? parsedStep : 1;
  const alignment = isSmallerScreen ? "center" : "left";

  useEffect(() => {
    if (documentationStatus) setStatus(documentationStatus);
  }, [documentationStatus]);

  return (
    <Dialog
      isOpen
      id="onboarding-steps"
      ariaLabel="Onboarding steps dialog"
      paddingNone
      widthFit
    >
      <div className="px-large pb-xxlarge pt-large md:p-xxxlarge">
        <div className={isSmallerScreen ? "max-w-max" : "max-w-[544px]"}>
          <StepProgress count={COUNT} current={step} />
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );

  function renderActionButtons() {
    const label = step < 2 ? "Get Started" : "Next";
    return (
      <Button onClick={handleClick} fullWidth>
        {label}
      </Button>
    );
  }

  function handleClick() {
    const nextStep = step + 1;
    if (nextStep > COUNT) return;

    setStep(nextStep);
  }

  function renderTitle(title: string) {
    return (
      <div className="mb-large mt-xlarge flex">
        <Title level="h2" align={alignment}>
          {title}
        </Title>
      </div>
    );
  }

  function renderText(text: string) {
    return (
      <Text size="lg" align={alignment}>
        {text}
      </Text>
    );
  }

  function renderContent() {
    return {
      1: (
        <>
          {renderTitle("Welcome to PetPlace!")}
          {renderText(
            "Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place."
          )}
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img src={ASSET_IMAGES.comfyDogAndCat} alt="Comfy dog and cat" />
          </div>
          {renderActionButtons()}
        </>
      ),
      2: (
        <>
          {renderTitle("Important notice for 24Petwatch customers.")}
          {renderText(
            "Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace."
          )}
          <div className="mb-xlarge mt-large flex flex-col items-center gap-base md:w-full md:flex-row md:justify-center md:py-xxlarge">
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
          {renderActionButtons()}
        </>
      ),
      3: (
        <>
          {renderTitle("It's all about your pet!")}
          {renderText(
            "MyPets is where you keep track of all your pet's important stuff. Plus, recommendations on how to keep your pet protected!"
          )}
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img
              src={ASSET_IMAGES.friendlyDogAndCat}
              alt="Friendly dog and cat"
            />
          </div>
          {renderActionButtons()}
        </>
      ),
      4: renderDynamicContent(),
    }[step];
  }

  function renderDynamicContent() {
    return {
      none: (
        <>
          {renderTitle(
            "At PetPlace you can access all your pet's adoption documents."
          )}
          <Text size="lg" align={alignment}>
            Update, add files, download, or print. It's the one place to keep
            all your pet's details.{" "}
            <TextSpan fontWeight="semibold" display="inline">
              {`If available, would you like PetPlace to access and upload ${name}'s shelter documents for you?`}
            </TextSpan>
          </Text>
          <div className="mb-xlarge mt-large flex w-full justify-center">
            <img
              src={
                isSmallerScreen
                  ? ASSET_IMAGES.petServicesSm
                  : ASSET_IMAGES.petServices
              }
              alt="Icons representing available pet services"
            />
          </div>
          <ul className="my-xlarge flex flex-col items-center justify-center gap-xsmall md:flex-row">
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
      ),
      sent: (
        <>
          <div className="mt-xlarge flex w-full justify-center md:w-fit">
            <Loading size={64} />
          </div>
          <div className="my-large">
            <Title align={alignment}>Uploading...</Title>
          </div>
          {renderText(
            "Your pet’s documents are being processed. Please wait a moment while we complete the upload."
          )}
          <Button className="mt-xlarge text-neutral-500" fullWidth disabled>
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
      <div className="flex flex-col-reverse items-stretch gap-medium md:grid md:grid-cols-2">
        <Button variant="secondary" onClick={handleClick}>
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

  function renderUploadResponse(
    status: Exclude<DocumentationStatus, "none" | "sent">
  ) {
    const { icon, className, title, description } = responseVariables(status);

    return (
      <>
        <div className="flex w-full justify-center md:w-fit">
          <div
            className={classNames(
              "mb-large mt-xlarge flex h-[64px] w-[64px] items-center justify-center rounded-full",
              className
            )}
          >
            <Icon display={icon} size={25} />
          </div>
        </div>
        <Title align={alignment}>{title}</Title>
        <div className="mb-xlarge mt-large">
          <Text size="lg" align={alignment}>
            {description}
          </Text>
        </div>
        {renderActionButtons()}
      </>
    );
  }
};

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
