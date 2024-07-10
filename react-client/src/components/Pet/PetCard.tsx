import { classNames } from "~/util/styleUtil";
import { Card, Icon } from "../design-system";
import useCardBase, { UseCardBase } from "../design-system/card/useCardBase";
import { isBoolean } from "lodash";
import { ReactNode } from "react";

type PetCardProps = UseCardBase & {
  children: ReactNode;
  hasShadow?: boolean;
  img?: string;
  isProtected?: boolean;
  name: string;
};

export const PetCard = ({
  children,
  hasShadow,
  img,
  isProtected,
  name,
  variant,
  ...props
}: PetCardProps) => {
  const { className: baseClassName } = useCardBase({
    variant,
  });
  const isSimpleCard = isBoolean(isProtected);

  return (
    <Card {...props} hasShadow={hasShadow} radius="sm">
      <div className={`${isSimpleCard ? "" : "lg:flex"}`}>
        <div className={classNames(baseClassName)}>
          <img
            src={img}
            alt={name}
            className={`inset-0 w-full ${isSimpleCard ? "rounded-t-xl" : ""} object-cover`}
          />
          {isSimpleCard && (
            <div
              className={classNames(
                "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full",
                {
                  "bg-success-background text-success-contrast": isProtected,
                  "bg-error-background text-error-contrast": !isProtected,
                }
              )}
            >
              <Icon
                display={isProtected ? "shieldGood" : "shieldOff"}
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
