import { Locale, PetServices } from "~/domain/models/pet/PetModel";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { getPetWatchServiceOption } from "~/util/petWatchServiceUtils";

type PetWatchServicesProps = {
  locale?: Locale | null;
  onClick: (label?: string) => () => void;
  serviceStatus: PetServices["membershipStatus"];
};

export const PetWatchServices = ({
  locale,
  onClick,
  serviceStatus,
}: PetWatchServicesProps) => {
  const renderPetWatchOptions = getPetWatchServiceOption(serviceStatus, locale);

  return (
    <div className="grid gap-small pt-large">
      {renderPetWatchOptions.map(({ id, ...props }) => (
        <PetCardPetWatch key={id} onClick={onClick(id)} {...props} />
      ))}
    </div>
  );
};
