import { Outlet, useSearchParams } from "react-router-dom";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Header } from "~/components/design-system/header/Header";
import { CheckoutConclusionModal } from "~/components/Membership/CheckoutConclusionModal";
import { AdvertisingSection } from "~/components/Pet/sections/AdvertisingSection";
import { PetAlertSection } from "~/components/Pet/sections/PetAlertSection";
import { PetCardSection } from "~/components/Pet/sections/PetCardSection";
import { PetInsuranceSection } from "~/components/Pet/sections/PetInsuranceSection";
import { PetWatchSection } from "~/components/Pet/sections/PetWatchSection";
import { PetModel } from "~/domain/models/pet/PetModel";
import {
  CHECKOUT_FULL_ROUTE,
  MY_PETS_FULL_ROUTE,
} from "~/routes/AppRoutePaths";
import { invariant } from "~/util/invariant";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";
import { PetActionsDropdownMenu } from "./components/PetActionsDropdownMenu";
import { ReportPetButton } from "./components/ReportPetButton";
import { OnboardingDialog } from "./onboarding/OnboardingDialog";
import { PetLostUpdatesSection } from "./PetLostUpdates";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";

export const PetProfileIndex = () => {
  const [searchParams] = useSearchParams();
  const viewModel = usePetProfileContext();
  const { petInfo, lostAndFoundNotifications } = viewModel;

  return (
    <SuspenseAwait minHeight={"80dvh"} resolve={petInfo}>
      {renderPetProfile}
    </SuspenseAwait>
  );

  function renderPetProfile(pet: PetModel | null) {
    invariant(pet, "Pet not found");

    const displayOnboarding = !!searchParams.get("onboarding");

    const displayCheckoutSuccessModal = (() => {
      const contentParam = searchParams.get(CONTENT_PARAM_KEY);
      if (!contentParam) return false;

      return contentParam === "pet-watch-purchase-success";
    })();

    const { id, locale, membershipStatus, policyInsurance, products } = pet;

    const checkoutPath = CHECKOUT_FULL_ROUTE(id);

    const petInsuranceSectionElement = (() => {
      if (!policyInsurance?.length) return null;
      return <PetInsuranceSection petId={id} />;
    })();

    return (
      <>
        <PetAlertSection route={checkoutPath} />
        <Header
          backButtonTo={MY_PETS_FULL_ROUTE}
          pageTitle="Pet Profile"
          primaryElement={renderActionsButton()}
        />
        <div className="flex flex-col gap-xlarge">
          <PetCardSection pet={pet} />
          <AdvertisingSection />
          <PetWatchSection
            petServiceStatus={{ locale, membershipStatus, products }}
            route={checkoutPath}
          />
          {petInsuranceSectionElement}
          <SuspenseAwait resolve={lostAndFoundNotifications}>
            {(lostAndFoundNotifications) => {
              return (
                <PetLostUpdatesSection
                  lostPetHistory={lostAndFoundNotifications}
                  missingStatus={
                    lostAndFoundNotifications[
                      lostAndFoundNotifications.length - 1
                    ]?.status ?? "found"
                  }
                />
              );
            }}
          </SuspenseAwait>
        </div>
        <Outlet context={viewModel} />
        {displayOnboarding && <OnboardingDialog />}
        {displayCheckoutSuccessModal && <CheckoutConclusionModal petId={id} />}
      </>
    );

    function renderActionsButton() {
      const isFromMyPetHealth = pet?.sourceType === "MyPetHealth";

      return (
        <>
          <PetActionsDropdownMenu className="hidden lg:flex" />
          <ReportPetButton
            className="flex lg:hidden"
            disabled={!isFromMyPetHealth}
          />
        </>
      );
    }
  }
};
