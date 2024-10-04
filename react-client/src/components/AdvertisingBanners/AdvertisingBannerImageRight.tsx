import { ReactNode } from "react";
import { FromColorClasses } from "~/routes/types/styleTypes";
import { classNames } from "~/util/styleUtil";
import { ButtonProps, Card, LinkButton, Text } from "../design-system";
import { CardProps } from "../design-system/types/CardTypes";

type AdvertisingBannerImageRightProps = {
  buttonLabel?: string;
  buttonProps?: ButtonProps;
  cardStyleProps?: Omit<CardProps, "children">;
  gradientColor?: FromColorClasses;
  gradientDirection?: "top" | "right" | "bottom" | "left";
  img?: string;
  imgName?: string;
  message?: string;
  subMessage?: string;
  title: ReactNode;
  to?: string;
};

export const AdvertisingBannerImageRight = ({
  buttonLabel,
  buttonProps,
  cardStyleProps,
  gradientColor,
  gradientDirection,
  img,
  imgName,
  message,
  subMessage,
  title,
  to,
}: AdvertisingBannerImageRightProps) => {
  return (
    <Card {...cardStyleProps} role="region">
      <div className="grid grid-cols-1 justify-between p-large lg:flex">
        <div className="flex max-w-[455px] flex-col items-start justify-between pr-xxxxxlarge">
          <div className="grid gap-base pb-xxxxxlarge">
            {title}
            <Text size="18">{message}</Text>
            <Text size="12">{subMessage}</Text>
          </div>

          {renderActionButton("hidden lg:block")}
        </div>

        <div className="relative m-[-24px] flex w-auto lg:max-h-[500px] lg:max-w-[500px]">
          {renderImage()}

          <div className="absolute bottom-[24px] block w-full px-large lg:hidden">
            {renderActionButton()}
          </div>
        </div>
      </div>
    </Card>
  );

  function renderActionButton(customClasses?: string) {
    return (
      <LinkButton
        variant="primary"
        {...buttonProps}
        to={to ?? ""}
        className={classNames(buttonProps?.className, customClasses)}
        fullWidth
      >
        {buttonLabel}
      </LinkButton>
    );
  }

  function renderImage() {
    if (!img && !imgName) return;

    return (
      <>
        <img className="h-full w-full object-cover" alt={imgName} src={img} />

        {img && (
          <div
            className={classNames(
              "absolute inset-0 bg-gradient-to-b via-transparent bg-y-small-gradient lg:bg-x-small-gradient",
              gradientColor,
              {
                "lg:bg-gradient-to-b": gradientDirection === "bottom",
                "lg:bg-gradient-to-l": gradientDirection === "left",
                "lg:bg-gradient-to-r": gradientDirection === "right",
                "lg:bg-gradient-to-t": gradientDirection === "top",
              }
            )}
          />
        )}
      </>
    );
  }
};
