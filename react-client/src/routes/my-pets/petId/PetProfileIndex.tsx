import { Outlet, useSearchParams } from "react-router-dom";
import { Header } from "~/components/design-system/header/Header";
import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import { CheckoutConclusionModal } from "~/components/Membership/CheckoutConclusionModal";
import { AdvertisingSection } from "~/components/Pet/sections/AdvertisingSection";
import { PetAlertSection } from "~/components/Pet/sections/PetAlertSection";
import { PetCardSection } from "~/components/Pet/sections/PetCardSection";
import { PetInsuranceSection } from "~/components/Pet/sections/PetInsuranceSection";
import { PetWatchSection } from "~/components/Pet/sections/PetWatchSection";
import {
  CHECKOUT_FULL_ROUTE,
  MY_PETS_FULL_ROUTE,
} from "~/routes/AppRoutePaths";
import { invariant } from "~/util/invariant";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";
import { PetActionsDropdownMenu } from "./components/PetActionsDropdownMenu";
import { ReportPetButton } from "./components/ReportPetButton";
import { TransferPetDialog } from "./components/TransferPetDialog";
import { OnboardingDialog } from "./onboarding/OnboardingDialog";
import { PetLostUpdatesSection } from "./PetLostUpdates";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";
import { ReportClosingModal } from "~/components/Pet/ReportClosingModal";

export const PetProfileIndex = () => {
  const [searchParams] = useSearchParams();
  const viewModel = usePetProfileContext();
  const { isLoading, pet, lostPetHistory, onClickReportPetFound } = viewModel;

  if (isLoading) return <DefaultLoading minHeight="80dvh" />;

  invariant(pet, "Pet not found");

  const displayOnboarding = !!searchParams.get("onboarding");

  const displayCheckoutSuccessModal = (() => {
    const contentParam = searchParams.get(CONTENT_PARAM_KEY);
    if (!contentParam) return false;

    return contentParam === "pet-watch-purchase-success";
  })();

  const { id, policyInsurance } = pet;

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
        <AdvertisingSection linkTo={pet.insuranceUrl} />
        <PetWatchSection route={checkoutPath} />
        {petInsuranceSectionElement}
        <PetLostUpdatesSection
          lostPetHistory={lostPetHistory}
          onClickReportPetFound={onClickReportPetFound}
          missingStatus={pet.missingStatus}
        />
      </div>
      <Outlet context={viewModel} />
      {displayOnboarding && <OnboardingDialog pet={pet} />}
      {displayCheckoutSuccessModal && <CheckoutConclusionModal petId={id} />}
      <TransferPetDialog />
    </>
  );

  function renderActionsButton() {
    if (!pet) return null;

    const isFromMyPetHealth = pet?.sourceType === "MyPetHealth";

    return (
      <>
        <PetActionsDropdownMenu className="hidden lg:flex" />
        <ReportPetButton
          className="flex lg:hidden"
          disabled={!isFromMyPetHealth}
          missingStatus={pet.missingStatus}
        />
      </>
    );
  }
};
