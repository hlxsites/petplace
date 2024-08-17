import { Outlet, useSearchParams } from "react-router-dom";
import { Header } from "~/components/design-system/header/Header";
import { AdvertisingSection } from "~/components/Pet/sections/AdvertisingSection";
import { PetAlertSection } from "~/components/Pet/sections/PetAlertSection";
import { PetCardSection } from "~/components/Pet/sections/PetCardSection";
import { PetInsuranceSection } from "~/components/Pet/sections/PetInsurancecSection";
import { PetWatchSection } from "~/components/Pet/sections/PetWatchSection";
import { PetActionsDropdownMenu } from "./components/PetActionsDropdownMenu";
import { ReportLostPetButton } from "./components/ReportLostPetButton";
import { OnboardingDialog } from "./onboarding/OnboardingDialog";
import { PetLostUpdatesSection } from "./PetLostUpdates";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";

export const PetProfileIndex = () => {
  const [searchParams] = useSearchParams();
  const viewModel = usePetProfileContext();
  const { petInfo, petServiceStatus } = viewModel;

  const displayOnboarding = !!searchParams.get("onboarding");

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
      {displayOnboarding && <OnboardingDialog {...petInfo} />}
    </>
  );

  function renderActionsButton() {
    return (
      <>
        <PetActionsDropdownMenu className="hidden lg:flex" />
        <ReportLostPetButton className="flex lg:hidden" />
      </>
    );
  }
};
