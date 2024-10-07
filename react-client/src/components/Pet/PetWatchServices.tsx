import { SuspenseAwait } from "../await/SuspenseAwait";
import { PetCardPetWatch, PetCardPetWatchProps } from "./PetCardPetWatch";

type PetWatchServicesProps = {
  onClick: (label?: string) => () => void;
  petWatchBenefits: Promise<PetCardPetWatchProps[]>;
};

export const PetWatchServices = ({
  onClick,
  petWatchBenefits,
}: PetWatchServicesProps) => {
  return (
    <div className="grid gap-small pt-large">
      <SuspenseAwait resolve={petWatchBenefits}>
        {(petWatchBenefits) =>
          petWatchBenefits.map(({ id, ...props }) => (
            <PetCardPetWatch key={id} onClick={onClick(id)} {...props} />
          ))
        }
      </SuspenseAwait>
    </div>
  );
};
