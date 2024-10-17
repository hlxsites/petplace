import { PetModel } from "~/domain/models/pet/PetModel";
import { PetCardInfo } from "~/routes/my-pets/petId/components/PetCardInfo";
import { PetCard } from "../PetCard";

export const PetCardSection = ({ pet }: { pet: PetModel }) => {
  return (
    <PetCard
      classNames={{ root: "lg:flex" }}
      name={pet.name}
      img={pet.img}
      speciesId={pet.speciesId}
      variant="lg"
    >
      <PetCardInfo {...pet} name={pet.name} />
    </PetCard>
  );
};
