import PetCard from "~/components/card/PetCard";
import { Title } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

  return (
    <>
      <Title>My Pets</Title>
      <div className="mt-base px-base tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 grid w-full grid-flow-row grid-cols-1 justify-center gap-6">
        {pets.map((pet) => {
          return (
            <div key={pet.name} className="flex w-full justify-center">
              <PetCard {...pet} />
            </div>
          );
        })}
      </div>
    </>
  );
};
