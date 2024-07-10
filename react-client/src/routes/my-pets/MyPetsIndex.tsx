import { PetCard } from "~/components/Pet/PetCard";
import { Button, ButtonProps } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";
import { Layout } from "~/components/design-system/layout/Layout";
import { Header } from "~/components/design-system/header/Header";
import { Link } from "react-router-dom";
import { AppRoutePaths } from "../AppRoutePaths";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

  return (
    <Layout>
      <Header
        pageTitle="My Pets"
        primaryElement={renderMyPetsHeadButtons()}
        secondaryElement={renderReportLostOrFound({
          className: "md:hidden w-full",
        })}
      />

      <div className="grid w-full grid-flow-row grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Link key={`link-${pet.id}`} to={pet.id}>
            <PetCard hasShadow={true} key={pet.name} {...pet}>
              <div className="p-base text-2xl font-bold leading-none text-black">
                {pet.name}
              </div>
            </PetCard>
          </Link>
        ))}
      </div>
    </Layout>
  );

  function renderReportLostOrFound(props: Pick<ButtonProps, "className">) {
    return (
      <Button variant="secondary" iconLeft="warningTriangle" {...props}>
        Report a lost or found pet
      </Button>
    );
  }

  function renderMyPetsHeadButtons() {
    return (
      <div className="flex gap-2">
        {renderReportLostOrFound({
          className: "hidden md:block",
        })}
        <Link to={AppRoutePaths.addNewPet}>
          <Button iconLeft="add">Add a new pet</Button>
        </Link>
      </div>
    );
  }
};
