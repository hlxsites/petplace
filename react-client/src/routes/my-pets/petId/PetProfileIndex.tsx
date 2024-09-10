import { Outlet, useSearchParams } from "react-router-dom";
import { Header } from "~/components/design-system/header/Header";
import { CheckoutConclusionModal } from "~/components/Membership/CheckoutConclusionModal";
import { AdvertisingSection } from "~/components/Pet/sections/AdvertisingSection";
import { PetAlertSection } from "~/components/Pet/sections/PetAlertSection";
import { PetCardSection } from "~/components/Pet/sections/PetCardSection";
import { PetInsuranceSection } from "~/components/Pet/sections/PetInsurancecSection";
import { PetWatchSection } from "~/components/Pet/sections/PetWatchSection";
import { MY_PETS_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";
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

  const displayCheckoutSuccessModal = (() => {
    const contentParam = searchParams.get(CONTENT_PARAM_KEY);
    if (!contentParam) return false;

    return contentParam === "pet-watch-purchase-success";
  })();

  return (
    <>
      <PetAlertSection />
      <Header
        backButtonTo={MY_PETS_FULL_ROUTE}
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
      />
      <div className="flex flex-col gap-xlarge">
        <PetCardSection pet={petInfo} />
        <AdvertisingSection />
        {petServiceStatus && (
          <PetWatchSection petServiceStatus={petServiceStatus} />
        )}
        <PetInsuranceSection />
        <PetLostUpdatesSection {...petInfo} />
      </div>
      <Outlet context={viewModel} />
      {displayOnboarding && <OnboardingDialog />}
      {displayCheckoutSuccessModal && (
        <CheckoutConclusionModal petId={petInfo.id} />
      )}
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
