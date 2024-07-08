import { PetCard } from "~/components/Pet/PetCard";
import { Button, ButtonProps, Title } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";
import { Layout } from "~/components/design-system/layout/Layout";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

  return (
    <Layout>
      {getHeader()}

      <div className="grid w-full grid-flow-row grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard key={pet.name} {...pet} />
        ))}
      </div>
    </Layout>
  );

  function getHeader() {
    return (
      <div className="mb-large lg:mb-xxlarge">
        <div className="mb-large flex items-center justify-between lg:m-0">
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
