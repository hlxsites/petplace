import { PetCard } from "~/components/Pet/PetCard";
import { Button, ButtonProps, Title } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

  return (
    <div className="px-base">
      {getHeader()}

      <div className="sm:grid-cols-2 lg:grid-cols-3 grid w-full grid-flow-row grid-cols-1 justify-center gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.name} {...pet} />
        ))}
      </div>
    </div>
  );

  function getHeader() {
    return (
      <div className="lg:mb-xxlarge mb-large">
        <div className="lg:m-0 mb-large flex items-center justify-between">
          <Title>My Pets</Title>
          <div className="flex gap-2">
            {renderReportLostOrFound({
              className: "hidden md:block",
            })}
            <Button iconLeft="add">Add a new pet</Button>
          </div>
        </div>

        {renderReportLostOrFound({ className: "md:hidden w-full" })}
      </div>
    );
  }

  function renderReportLostOrFound(props: Pick<ButtonProps, "className">) {
    return (
      <Button variant="secondary" iconLeft="warningTriangle" {...props}>
        Report a lost or found pet
      </Button>
    );
  }
};
