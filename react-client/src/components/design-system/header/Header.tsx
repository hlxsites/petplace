import { Title } from "../text/Title";
import { LinkIconButton } from "../button/LinkIconButton";
import { ReactNode } from "react";

type HeaderProps = {
  pageTitle: string;
  primaryElement?: ReactNode;
  secondaryElement?: ReactNode;
  shouldRenderBackButton?: boolean;
};

export const Header = ({
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
            <LinkIconButton
              buttonProps={{ label: "Back button", icon: "chevronLeft" }}
              to=".."
              relative="path"
            />
          )}
          <Title>{pageTitle}</Title>
        </div>
        {primaryElement}
      </div>
      {secondaryElement}
    </div>
  );
};
