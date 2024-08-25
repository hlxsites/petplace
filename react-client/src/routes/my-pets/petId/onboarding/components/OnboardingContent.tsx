import { ReactNode } from "react";
import { Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";

type OnboardingContentProps = {
  alignment: "center" | "left";
  children?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  message?: string;
  title: string;
};

export const OnboardingContent = ({
  alignment,
  children,
  footer,
  header,
  message,
  title,
}: OnboardingContentProps) => {
  const headerElement = (() => {
    if (!header) return null;
    return <div className="flex w-full justify-center md:w-fit">{header}</div>;
  })();

  const messageElement = (() => {
    if (!message) return null;
    return (
      <Text size="base" align={alignment}>
        {message}
      </Text>
    );
  })();

  return (
    <div className="flex flex-col gap-large">
      {headerElement}
      <Title level="h2" align={alignment}>
        {title}
      </Title>
      {messageElement}
      {children}
      {footer}
    </div>
  );
};
