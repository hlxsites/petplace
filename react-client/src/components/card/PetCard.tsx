import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";
import Card from "./Card";

type PetCardProps = {
  name: string;
  img?: string;
  isProtected: boolean;
};

const PetCard = ({ name, img, isProtected, ...props }: PetCardProps) => {
  return (
    <Card {...props} hasShadow={true} radius="sm">
      <div className="bg-neutral-400 h-[312x] w-[306px] max-w-[312px] rounded-xl">
        <div className="z-10 flex h-[246px] justify-end">
          <div className="relative h-full w-full">
            <div className="p-base relative z-10 flex justify-end">
              <div
                className={classNames(
                  "p-base flex h-8 w-8 items-center justify-center rounded-full bg-white",
                  isProtected ? "text-green-500" : "text-red-500"
                )}
              >
                <Icon display={isProtected ? "shieldGood" : "shieldOff"} />
              </div>
            </div>
            <img
              src={img}
              alt={`Image of animal: ${name}`}
              className="absolute inset-0 z-0 h-full w-full rounded-t-xl object-cover"
            />
          </div>
        </div>
        <div className="bg-neutral-white p-base z-0 rounded-b-xl">
          <span className="h-[28px] text-2xl font-semibold text-black">
            {name}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
