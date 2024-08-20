import { ReactNode } from "react";
import { Button, Icon, IconKeys, Loading, Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";
import { classNames } from "~/util/styleUtil";

type OnboardingContentProps = {
  alignment: "center" | "left";
  buttonDisabled?: boolean;
  buttonLabel?: string;
  children?: ReactNode;
  hideButton?: boolean;
  icon?: IconKeys;
  iconClassName?: string;
  message?: string;
  onNextStep: () => void;
  preTitle?: boolean;
  title: string;
};

export const OnboardingContent = ({
  alignment,
  buttonDisabled,
  buttonLabel,
  children,
  hideButton,
  icon,
  iconClassName,
  message,
  onNextStep,
  preTitle,
  title,
}: OnboardingContentProps) => {
  return (
    <div className="flex flex-col gap-large">
      {preTitle && (

      <div className="flex w-full justify-center md:w-fit">
      {icon ? (
        <div
          className={classNames(
            "flex h-[64px] w-[64px] items-center justify-center rounded-full",
            iconClassName
          )}
        >
          <Icon display={icon} size={25} />
        </div>
      ) : (
        <Loading size={64} />
      )}
    </div>
      )}
      <Title level="h2" align={alignment}>{title}</Title>
      {!!message && <Text size="base" align={alignment}>{message}</Text>}
      {!!children && children}
      {!hideButton && (
        <Button onClick={onNextStep} fullWidth disabled={buttonDisabled} className="disabled:text-neutral-500">
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
