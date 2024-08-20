import { ReactNode } from "react";
import { Icon, IconKeys, Loading, Text } from "~/components/design-system";
import { Title } from "~/components/design-system/text/Title";
import { classNames } from "~/util/styleUtil";

type OnboardingContentProps = {
  alignment: "center" | "left";
  children?: ReactNode;
  footer?: ReactNode;
  icon?: IconKeys;
  iconClassName?: string;
  message?: string;
  preTitle?: boolean;
  title: string;
};

export const OnboardingContent = ({
  alignment,
  children,
  footer,
  icon,
  iconClassName,
  message,
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
      <Title level="h2" align={alignment}>
        {title}
      </Title>
      {!!message && (
        <Text size="base" align={alignment}>
          {message}
        </Text>
      )}
      {!!children && children}
      {footer}
    </div>
  );
};
