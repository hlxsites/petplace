import { Layout } from "~/components/design-system/layout/Layout";
import { usePetProfileIndexViewModel } from "./usePetProfileIndexViewModel";
import { Header } from "~/components/design-system/header/Header";
import { Button } from "~/components/design-system";

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileIndexViewModel();

  return (
    <Layout>
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <div>{petInfo}</div>
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
