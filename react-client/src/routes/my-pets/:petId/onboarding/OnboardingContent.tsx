import { ReactNode } from "react";
import { Button, Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";

type OnboardingContentProps = {
  children: ReactNode;
  message: string;
  onNextStep: () => void;
  step: number;
  title: string;
};

export const OnboardingContent = ({
  children,
  message,
  onNextStep,
  step,
  title,
}: OnboardingContentProps) => {
  const buttonLabel = step < 2 ? "Get Started" : "Next";

  return (
    <div className="flex flex-col gap-large">
      <Title level="h2">{title}</Title>
      <Text size="base">{message}</Text>
      {children}
      <Button onClick={onNextStep} fullWidth>
        {buttonLabel}
      </Button>
    </div>
  );
};
