import { ReactNode } from "react";
import { To } from "react-router-dom";
import { classNames } from "~/util/styleUtil";
import { LinkIconButton } from "../button/LinkIconButton";
import { Title, TitleProps } from "../text/Title";

type HeaderProps = {
  backButtonTo?: To;
  mb?: "large" | "small";
  pageTitle: string;
  primaryElement?: ReactNode;
  secondaryElement?: ReactNode;
  titleProps?: Omit<TitleProps, "children">;
};

export const Header = ({
  backButtonTo,
  mb = "large",
  pageTitle,
  primaryElement,
  secondaryElement,
  titleProps,
}: HeaderProps) => {
  const { className } = useHeaderBase(mb);

  return (
    <div className={className}>
      <div className="mb-large flex items-center justify-between lg:m-0">
        <div className="flex items-center">
          {!!backButtonTo && (
            <LinkIconButton
              buttonProps={{
                className: "text-orange-300-contrast",
                icon: "chevronLeft",
              }}
              className="ml-[-12px]"
              label="Back to previous page"
              to={backButtonTo}
            />
          )}
          <Title level="h2" isResponsive {...titleProps}>
            {pageTitle}
          </Title>
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
