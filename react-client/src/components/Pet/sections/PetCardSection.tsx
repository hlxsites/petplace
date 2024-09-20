import { PetModel } from "~/domain/models/pet/PetModel";
import { PetCardInfo } from "~/routes/my-pets/petId/components/PetCardInfo";
import { PetCard } from "../PetCard";

export const PetCardSection = ({ pet }: { pet: PetModel }) => {
  return (
    <PetCard
      classNames={{ root: "lg:flex" }}
      variant="lg"
      {...pet}
    >
      <PetCardInfo {...pet} name={pet.name} />
    </PetCard>
  );
};
