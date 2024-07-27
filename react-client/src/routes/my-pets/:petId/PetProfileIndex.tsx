import { Button } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { PetCard } from "~/components/Pet/PetCard";
import { PetCardInfo } from "~/components/Pet/PetCardInfo";
import { usePetProfileContext } from "./PetProfileLayout";

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileContext();

  return (
    <Layout>
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <PetCard
        classNames={{ root: "lg:flex" }}
        img={petInfo.img}
        name={petInfo.name}
        variant="lg"
      >
        <PetCardInfo {...petInfo} name={petInfo.name} />
      </PetCard>
    </Layout>
  );
};

function renderActionsButton() {
  return (
    <>
      <Button
        className="hidden lg:block"
        iconLeft="apps"
        variant="secondary"
        iconProps={{ className: "text-brand-secondary" }}
      >
        Actions
      </Button>
      <Button
        className="block lg:hidden"
        iconLeft="shieldGood"
        iconProps={{ className: "text-brand-secondary" }}
        variant="secondary"
      >
        Report lost pet
      </Button>
    </>
  );
}
