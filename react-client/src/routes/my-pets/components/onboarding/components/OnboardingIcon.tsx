import { Icon, IconKeys } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";

type OnboardingIconProps = {
  className?: string;
  display: IconKeys;
};

export const OnboardingIcon = ({ className, display }: OnboardingIconProps) => {
  return (
    <div
      className={classNames(
        "flex size-[64px] items-center justify-center rounded-full",
        className
      )}
    >
      <Icon display={display} size={25} />
    </div>
  );
};
