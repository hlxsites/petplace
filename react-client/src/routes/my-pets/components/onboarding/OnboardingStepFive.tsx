import { Button, Icon, IconKeys, Text } from "~/components/design-system";
import { DocumentationStatus } from "~/domain/models/pet/PetModel";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "./components/OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepFive = ({
  isSmallerScreen,
  onFinish,
  status,
  ...props
}: CommonOnboardingProps & {
  onFinish: () => void;
  status: DocumentationStatus;
}) => {
  return (
    <OnboardingContent
      {...props}
      footer={renderFinalActions()}
      message={ONBOARDING_STEPS_TEXTS[5].message}
      title={ONBOARDING_STEPS_TEXTS[5].title}
    >
      <div className="flex w-full justify-center">
        <div className="grid grid-rows-3 gap-[58px] md:grid-cols-3 md:grid-rows-1 md:py-xlarge">
          {renderStepsChoices({
            text: ONBOARDING_STEPS_TEXTS[5].microchip,
            icon: "checkSolo",
            accepted: true,
            isFirst: true,
          })}
          {renderStepsChoices({
            text: ONBOARDING_STEPS_TEXTS[5].documents,
            icon: "file",
            accepted: status !== "none",
          })}
          {renderStepsChoices({
            text: ONBOARDING_STEPS_TEXTS[5].protection,
            icon: "shieldGood",
            accepted: false,
          })}
        </div>
      </div>
    </OnboardingContent>
  );

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
              "absolute -top-[58px] left-[25px] h-[58px] w-0 border-2 border-solid md:-top-[48px] md:rotate-90",
              {
                "border-border-strong md:-left-[31px] md:h-[148px]": !accepted,
                "border-purple-300 md:-left-[32px] md:h-[147.25px]": accepted,
              }
            )}
          />
        )}
        <Icon
          display={accepted ? "checkSolo" : icon}
          className={classNames("rounded-full border border-solid p-base", {
            "border-2 text-purple-500": accepted,
          })}
          size={53}
        />
        <Text
          size="16"
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
      <Button fullWidth onClick={onFinish}>
        Finish
      </Button>
    );
  }
};
