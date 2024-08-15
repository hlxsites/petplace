import { ReactNode } from "react";
import { Button, Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";

type OnboardingContentProps = {
  ariaLable: string;
  mainContent: ReactNode;
  message: string;
  onNextStep: () => void;
  step: number;
  title: string;
};

export const OnboardingContent = ({
  ariaLable,
  mainContent,
  message,
  onNextStep,
  step,
  title,
}: OnboardingContentProps) => {
  const buttonLabel = step < 2 ? "Get Started" : "Next";

  return (
    <div aria-label={ariaLable}>
      <Title>{title}</Title>
      <Text>{message}</Text>
      {mainContent}
      <Button onClick={onNextStep} fullWidth>
        {buttonLabel}
      </Button>
    </div>
  );
};
