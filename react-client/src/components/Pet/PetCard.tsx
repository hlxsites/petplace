import { ReactNode } from "react";
import { ASSET_IMAGES } from "~/assets";
import { classNames as cx } from "~/util/styleUtil";
import { Card, CardProps, Icon } from "../design-system";

type PetCardProps = CardProps & {
  children: ReactNode;
  classNames?: {
    root?: string;
  };
  displayProtectedBadge?: {
    isProtected: boolean;
  };
  img?: string;
  name: string;
  species?: string;
  variant?: "sm" | "md" | "lg";
};

export const PetCard = ({
  children,
  classNames,
  displayProtectedBadge,
  img,
  name,
  variant,
  species,
  ...props
}: PetCardProps) => {
  const avatar =
    species === "cat" ? ASSET_IMAGES.catAvatar : ASSET_IMAGES.dogAvatar;
  return (
    <Card {...props} radius="sm">
      <div className={classNames?.root}>
        <div
          className={cx("relative flex w-full", {
            "h-[191px] lg:h-[246px]": variant === "sm",
            "h-[246px] lg:max-h-[306px]": variant === "md",
            "h-[240px] lg:h-[372px] lg:max-w-[368px]": variant === "lg",
          })}
        >
          <img
            src={img || avatar}
            alt={`Image of ${name}`}
            className="h-full w-full object-cover"
          />
          {displayProtectedBadge && (
            <div
              className={cx(
                "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full",
                {
                  "bg-success-background text-success-contrast":
                    displayProtectedBadge.isProtected,
                  "bg-error-background text-error-contrast":
                    !displayProtectedBadge.isProtected,
                }
              )}
            >
              <Icon
                display={
                  displayProtectedBadge.isProtected ? "shieldGood" : "shieldOff"
                }
                size={16}
              />
            </div>
          )}
        </div>
        {children}
      </div>
    </Card>
  );
};
