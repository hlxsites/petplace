import { Outlet } from "react-router-dom";
import { Button, Card, Text } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { PetAlertMessage } from "~/components/Pet/PetAlertMessage";
import { PetCard } from "~/components/Pet/PetCard";
import { PetCardInfo } from "~/components/Pet/PetCardInfo";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";

export const PetProfileIndex = () => {
  const viewModel = usePetProfileContext();
  const { petInfo } = viewModel;

  return (
    <Layout>
      <div className="pb-xxlarge">
        <PetAlertMessage petName={petInfo.name} />
      </div>
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <div className="grid gap-large">
        <PetCard
          classNames={{ root: "lg:flex" }}
          img={petInfo.img}
          name={petInfo.name}
          variant="lg"
        >
          <PetCardInfo {...petInfo} name={petInfo.name} />
        </PetCard>
        {renderPetInsuranceSection()}
      </div>
      <Outlet context={viewModel} />
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

function renderPetInsuranceSection() {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center justify-items-center gap-large p-large md:items-start md:justify-items-start">
        <Text fontFamily="raleway" fontWeight="bold" size="lg">
          See pet's insurance in MyPetHealth
        </Text>

        <Button fullWidth={true} variant="secondary">
          View insurance details
        </Button>
      </div>
    </Card>
  );
}