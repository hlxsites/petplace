import { classNames } from "~/util/styleUtil";
import { Card, Icon } from "../design-system";

type PetCardProps = {
  name: string;
  img?: string;
  isProtected: boolean;
};

export const PetCard = ({ name, img, isProtected, ...props }: PetCardProps) => {
  return (
    <Card {...props} hasShadow={true} radius="sm">
      <div className="lg:max-h-[306px] max-h-[251px] w-full" data-testid="pet-card">
        <div className="lg:h-[246px] relative flex h-[191px] w-full justify-end">
          <img
            src={img}
            alt={`Pet's name: ${name}`}
            className="lg:h-[246px] inset-0 h-[191px] w-full rounded-t-xl object-cover"
          />
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
        </div>
        <div className="p-base text-2xl font-bold leading-none text-black">
          {name}
        </div>
      </div>
    </Card>
  );
};
