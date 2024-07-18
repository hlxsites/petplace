import { Button } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { PetCard } from "~/components/Pet/PetCard";
import { PetCardInfo } from "~/components/Pet/PetCardInfo";
import { usePetProfileIndexViewModel } from "./usePetProfileIndexViewModel";

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileIndexViewModel();
  if (!petInfo) return;

  return (
    <Layout>
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <PetCard img={petInfo.img} name={petInfo.name} variant="lg">
        <PetCardInfo {...petInfo} name={petInfo.name} />
      </PetCard>
    </Layout>
  );
};

function renderActionsButton() {
  return (
    <Button iconLeft="apps" variant="secondary">
      Actions
    </Button>
  );
}
