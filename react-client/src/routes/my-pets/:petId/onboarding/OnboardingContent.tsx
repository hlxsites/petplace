import { ReactNode } from "react";
import { Button, Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";

type OnboardingContentProps = {
  alignment: "center" | "left";
  children: ReactNode;
  hideButton?: boolean;
  message?: string;
  onNextStep: () => void;
  step: number;
  title: string;
};

export const OnboardingContent = ({
  alignment,
  children,
  hideButton,
  message,
  onNextStep,
  step,
  title,
}: OnboardingContentProps) => {
  const buttonLabel = step < 2 ? "Get Started" : "Next";

  return (
    <div className="flex flex-col gap-large">
      <Title level="h2" align={alignment}>{title}</Title>
      {!!message && <Text size="base" align={alignment}>{message}</Text>}
      {children}
      {!hideButton && (
        <Button onClick={onNextStep} fullWidth>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
