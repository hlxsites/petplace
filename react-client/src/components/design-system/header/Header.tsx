import { ComponentProps, ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import { LinkIconButton } from "../button/LinkIconButton";
import { Title } from "../text/Title";

type HeaderProps = {
  mb?: "large" | "small";
  linkIconButtonProps?: ComponentProps<typeof LinkIconButton>;
  pageTitle: string;
  primaryElement?: ReactNode;
  secondaryElement?: ReactNode;
  shouldRenderBackButton?: boolean;
};

export const Header = ({
  linkIconButtonProps = {
    buttonProps: {
      label: "Back button",
      icon: "chevronLeft",
    },
    relative: "path",
    to: "..",
  },
  mb = "large",
  pageTitle,
  primaryElement,
  secondaryElement,
  shouldRenderBackButton,
}: HeaderProps) => {
  const { className } = useHeaderBase(mb);

  return (
    <div className={className}>
      <div className="mb-large flex items-center justify-between lg:m-0">
        <div className="flex items-center">
          {shouldRenderBackButton && (
            <LinkIconButton {...linkIconButtonProps} />
          )}
          <Title>{pageTitle}</Title>
        </div>
        {primaryElement}
      </div>
      {secondaryElement}
    </div>
  );
};

function useHeaderBase(mb: HeaderProps["mb"]) {
  const className = classNames({
    "mb-large lg:mb-xxlarge": mb === "large",
    "mb-small": mb === "small",
  });
  return { className };
}
