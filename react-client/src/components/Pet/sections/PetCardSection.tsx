import { PetInfo } from "~/mocks/MockRestApiServer";
import { PetCardInfo } from "~/routes/my-pets/petId/components/PetCardInfo";
import { PetCard } from "../PetCard";

export const PetCardSection = ({ petInfo }: { petInfo: PetInfo }) => {
  return (
    <PetCard
      classNames={{ root: "lg:flex" }}
      img={petInfo.img}
      name={petInfo.name}
      variant="lg"
    >
      <PetCardInfo {...petInfo} name={petInfo.name} />
    </PetCard>
  );
};
