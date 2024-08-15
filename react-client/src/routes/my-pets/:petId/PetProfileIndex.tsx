import { Outlet } from "react-router-dom";
import { Button } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { PetLostUpdatesSection } from "./PetLostUpdates";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";
import { PetWatchSection } from "~/components/Pet/sections/PetWatchSection";
import { PetCardSection } from "~/components/Pet/sections/PetCardSection";
import { PetInsuranceSection } from "~/components/Pet/sections/PetInsurancecSection";
import { AdvertisingSection } from "~/components/Pet/sections/AdvertisingSection";
import { PetAlertSection } from "~/components/Pet/sections/PetAlertSection";

export const PetProfileIndex = () => {
  const viewModel = usePetProfileContext();
  const { petInfo, petServiceStatus } = viewModel;

  return (
    <>
      <PetAlertSection />
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <div className="flex flex-col gap-large">
        <PetCardSection petInfo={petInfo} />
        <AdvertisingSection />
        {petServiceStatus && (
          <PetWatchSection petServiceStatus={petServiceStatus} />
        )}
        <PetInsuranceSection />
        <PetLostUpdatesSection {...petInfo} />
      </div>
      <Outlet context={viewModel} />
    </>
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
