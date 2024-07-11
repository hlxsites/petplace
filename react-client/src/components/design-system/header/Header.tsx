import { Title } from "../text/Title";
import { LinkIconButton } from "../button/LinkIconButton";
import { ComponentProps, ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

type HeaderProps = {
  mbHeader?: "large" | "small";
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
  mbHeader = "large",
  pageTitle,
  primaryElement,
  secondaryElement,
  shouldRenderBackButton,
}: HeaderProps) => {
  const { className } = useHeaderBase(mbHeader);

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

function useHeaderBase(mb: HeaderProps["mbHeader"]) {
  const className = classNames({
    "mb-large lg:mb-xxlarge": mb === "large",
    "mb-small": mb === "small",
  });
  return { className };
}
