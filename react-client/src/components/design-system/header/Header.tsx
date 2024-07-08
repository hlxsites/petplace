import { Title } from "../text/Title";
import { LinkIconButton } from "../button/LinkIconButton";
import { ComponentProps, ReactNode } from "react";

type HeaderProps = {
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
  pageTitle,
  primaryElement,
  secondaryElement,
  shouldRenderBackButton,
}: HeaderProps) => {
  return (
    <div className="mb-large lg:mb-xxlarge">
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
