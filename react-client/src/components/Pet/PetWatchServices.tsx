import { PetCardPetWatch, PetCardPetWatchProps } from "./PetCardPetWatch";

type PetWatchServicesProps = {
  onClick: (label?: string) => () => void;
  petWatchBenefits: PetCardPetWatchProps[];
};

export const PetWatchServices = ({
  onClick,
  petWatchBenefits,
}: PetWatchServicesProps) => {
  return (
    <div className="grid gap-small pt-large">
      {petWatchBenefits.map(({ id, ...props }) => (
        <PetCardPetWatch key={id} onClick={onClick(id)} {...props} />
      ))}
    </div>
  );
};
