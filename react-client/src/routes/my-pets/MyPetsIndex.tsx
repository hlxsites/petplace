import PetCard from "~/components/card/PetCard";
import { Title } from "~/components/design-system";

export const MyPetsIndex = ({ pets }: { pets: any[] }) => {
  return (
    <>
      <Title>My Pets</Title>
      <div className="mt-base grid w-full grid-flow-row grid-cols-1 justify-center gap-6 px-base tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
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
