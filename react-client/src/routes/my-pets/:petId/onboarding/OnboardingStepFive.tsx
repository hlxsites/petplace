import { Button, Icon, IconKeys, Text } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";
import { OnboardingContent } from "./OnboardingContent";
import { CommonOnboardingProps } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

export const OnboardingStepFive = ({
  isSmallerScreen,
  status,
  reset,
  ...props
}: CommonOnboardingProps & {
  status: string;
  reset: () => void;
}) => {
  return (
    <OnboardingContent
      {...props}
      footer={renderFinalActions()}
      message={ONBOARDING_STEPS_TEXTS[5].message(status)}
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
};
