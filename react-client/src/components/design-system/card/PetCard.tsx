import { Icon } from "../icon/Icon";
import Card from "./Card";
import { classNames } from "~/util/styleUtil";

interface IPetCardProps {
  "aria-label"?: string;
  "data-testid"?: string;
  onClick?: () => void;
  name: string;
  img?: string;
  isProtected: boolean;
}

const PetCard = ({ name, img, isProtected, ...props }: IPetCardProps) => {
  return (
    <Card {...props} hasShadow={true} radius="sm">
      <div className="tablet:h-[306px] h-[251px] w-[327px] tablet:w-[312px] max-w-[312px] rounded-xl bg-neutral-400">
        <div className={`z-10 flex h-[191px] tablet:h-[246px] justify-end`}>
          <div className="relative w-full">
            <div className="z-10 relative flex justify-end p-base">
              <div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-white p-base",
                  isProtected ? "text-green-500" : "text-red-500"
                )}
              >
                <Icon
                  display={isProtected ? "shieldGood" : "shieldOff"}
                />
              </div>
            </div>
            <img
              src={img}
              alt={name}
              className="absolute inset-0 h-[191px] tablet:h-[246px] w-full rounded-t-xl object-cover z-0"
            />
          </div>
        </div>
        <div className="z-0 rounded-b-xl bg-neutral-white p-base">
          <span className="text-xl font-semibold text-black">
            {name}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
