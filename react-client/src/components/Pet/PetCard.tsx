import { ReactNode } from "react";
import { classNames as cx } from "~/util/styleUtil";
import { Card, CardProps, Icon } from "../design-system";
import usePetCardBase, { UsePetCardBase } from "./useCardBase";

type PetCardProps = UsePetCardBase &
  CardProps & {
    children: ReactNode;
    classNames?: {
      root?: string;
    };
    displayProtectedBadge?: {
      isProtected: boolean;
    };
    img?: string;
    name: string;
  };

export const PetCard = ({
  children,
  classNames,
  displayProtectedBadge,
  img,
  name,
  variant,
  ...props
}: PetCardProps) => {
  const { className: baseClassName } = usePetCardBase({
    variant,
  });

  return (
    <Card {...props} radius="sm">
      <div className={classNames?.root}>
        <div className={cx(baseClassName)}>
          <img src={img} alt={name} className="w-full object-cover" />
          {displayProtectedBadge && (
            <div
              className={cx(
                "right-4 top-4 absolute flex h-8 w-8 items-center justify-center rounded-full",
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
