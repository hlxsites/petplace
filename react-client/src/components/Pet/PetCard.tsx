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
      <div className="h-[251px] w-[327px] max-w-[312px] rounded-xl bg-neutral-400 tablet:h-[306px] tablet:w-[312px]">
        <div className={`z-10 flex h-[191px] justify-end tablet:h-[246px]`}>
          <div className="relative w-full">
            <div className="relative z-10 flex justify-end p-base">
              <div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-white p-base",
                  isProtected ? "text-green-500" : "text-red-500"
                )}
              >
                <Icon display={isProtected ? "shieldGood" : "shieldOff"} />
              </div>
            </div>
            <img
              src={img}
              alt={name}
              className="absolute inset-0 z-0 h-[191px] w-full rounded-t-xl object-cover tablet:h-[246px]"
            />
          </div>
        </div>
        <div className="z-0 rounded-b-xl bg-neutral-white p-base">
          <span className="text-xl font-semibold text-black">{name}</span>
        </div>
      </div>
    </Card>
  );
};
