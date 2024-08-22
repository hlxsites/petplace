import { PET_WATCH_OPTIONS } from "~/routes/my-pets/:petId/utils/petWatchConstants";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetWatchServiceProps } from "~/routes/my-pets/:petId/utils/petServiceDetails";

type PetWatchDrawerBodyProps = {
  contentDetails?: PetWatchServiceProps;
  onClick: (label?: string) => () => void;
};

export const PetWatchDrawerBody = ({
  contentDetails,
  onClick,
}: PetWatchDrawerBodyProps) => {
  if (contentDetails) return <PetServiceDetailsCard {...contentDetails} />;

  return (
    <div className="grid gap-small pt-large">
      {PET_WATCH_OPTIONS.map(({ id, ...props }) => (
        <PetCardPetWatch key={props.label} onClick={onClick(id)} {...props} />
      ))}
    </div>
  );
};
