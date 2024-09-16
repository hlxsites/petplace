import { ReactNode } from "react";
import { FromColorClasses } from "~/routes/types/styleTypes";
import { classNames } from "~/util/styleUtil";
import { Button, ButtonProps, Card, Text } from "../design-system";
import { CardProps } from "../design-system/types/CardTypes";

type AdvertisingBannerImageRightProps = {
  buttonLabel?: string;
  buttonProps?: ButtonProps;
  cardStyleProps?: Omit<CardProps, "children">;
  img?: string;
  imgName?: string;
  message?: string;
  title: ReactNode;
  gradientColor?: FromColorClasses;
  gradientDirection?: "top" | "right" | "bottom" | "left";
};

export const AdvertisingBannerImageRight = ({
  buttonLabel,
  buttonProps,
  cardStyleProps,
  img,
  imgName,
  message,
  title,
  gradientColor,
  gradientDirection,
}: AdvertisingBannerImageRightProps) => {
  return (
    <Card {...cardStyleProps} role="region">
      <div className="grid grid-cols-1 justify-between p-large lg:flex">
        <div className="flex max-w-[455px] flex-col items-start justify-between pr-xxxxxlarge">
          <div className="grid gap-base pb-xxxxxlarge">
            {title}
            <Text size="lg">{message}</Text>
          </div>

          {renderActionButton("hidden lg:block")}
        </div>

        <div className="relative m-[-24px] flex w-auto lg:max-h-[500px] lg:max-w-[500px]">
          {renderImage()}

          {renderActionButton(
            "absolute bottom-[24px] left-[24px] z-50 lg:hidden block"
          )}
        </div>
      </div>
    </Card>
  );

  function renderActionButton(customClasses?: string) {
    return (
      <Button
        {...buttonProps}
        className={classNames(buttonProps?.className, customClasses)}
      >
        {buttonLabel}
      </Button>
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
