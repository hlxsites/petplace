import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import {
  LostAndFountNotification,
  MissingStatus,
  PetModel,
} from "~/domain/models/pet/PetModel";
import getReportClosingReasonsUseCaseFactory from "~/domain/useCases/lookup/getReportClosingReasonsUseCaseFactory";
import getLostAndFoundNotificationsUseCaseFactory from "~/domain/useCases/pet/getLostAndFoundNotificationsUseCaseFactory";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "./types/PetServicesTypes";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";
import { PET_WATCH_OFFERS, PET_WATCH_TAGS } from "./utils/petServiceConstants";
import { getStatus } from "./utils/petServiceStatusUtils";
import {
  PetWatchOptionBasedOnMembershipStatus_CA,
  PetWatchOptionBasedOnMembershipStatus_US,
} from "./utils/petWatchConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const getLostAndFoundNotificationsUseCase =
    getLostAndFoundNotificationsUseCaseFactory(authToken);
  const useCase = petInfoUseCaseFactory(authToken);
  const petInfoPromise = useCase.query(petId);
  const getReportClosingReasonsUseCase =
    getReportClosingReasonsUseCaseFactory(authToken);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petId,
    petInfoPromise,
    lostAndFoundNotificationsPromise:
      getLostAndFoundNotificationsUseCase.query(petId),
    reportClosingReasons: getReportClosingReasonsUseCase.query(),
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const {
    documentTypes,
    lostAndFoundNotificationsPromise,
    petId,
    petInfoPromise,
    reportClosingReasons,
  } = useLoaderData<typeof loader>();

  const isLoadingRef = useRef({
    petInfo: true,
    lostPetHistory: true,
  });

  const [petInfo, setPetInfo] = useState<PetModel | null>(null);

  const [lostPetHistory, setLostPetHistory] = useState<
    LostAndFountNotification[]
  >([]);

  const isLoading = Object.values(isLoadingRef.current).some(Boolean);

  const missingStatus: MissingStatus = (() => {
    if (!lostPetHistory.length) return "found";

    const latestEntry = lostPetHistory[0];
    return latestEntry.status;
  })();

  const selectedPet: PetModel | null = (() => {
    if (!petInfo) return null;

    return {
      ...petInfo,
      missingStatus,
    };
  })();

  useDeepCompareEffect(() => {
    async function resolvePetInfoPromise() {
      const petInfo = await petInfoPromise;
      isLoadingRef.current.petInfo = false;
      setPetInfo(petInfo);
    }

    void resolvePetInfoPromise();
  }, [petInfoPromise]);

  useDeepCompareEffect(() => {
    async function resolveLostAndFoundNotificationsPromise() {
      const lostPetHistory = await lostAndFoundNotificationsPromise;
      isLoadingRef.current.lostPetHistory = false;
      setLostPetHistory(lostPetHistory);
    }

    void resolveLostAndFoundNotificationsPromise();
  }, [lostAndFoundNotificationsPromise]);

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  const closeReport = (reasonId: number) => {
    console.log("🚀 ~ petId, reasonId", petId, reasonId);
  };

  const getSelectedPetLocale = () => {
    const locale = petInfo?.locale ?? "US"; //
    return { locale };
  };

  const getPetServiceInfo = () => {
    const { locale } = getSelectedPetLocale();

    const membershipStatus = selectedPet?.membershipStatus;

    // Safe guard to avoid inconsistencies from the API bringing annual membership for Canadian animals
    if (
      membershipStatus?.toLocaleLowerCase().includes("annual") &&
      locale === "CA"
    )
      return { membershipStatus: null, serviceStatus: null };

    const serviceStatus = getStatus({
      products: selectedPet?.products,
      locale,
      membershipStatus,
    });

    return { membershipStatus, serviceStatus };
  };

  const getPetWatchInfo = () => {
    const { membershipStatus, serviceStatus } = getPetServiceInfo();

    if (serviceStatus === null) {
      return { petWatchOffersAndTags: null, membershipStatus };
    }

    const petWatchOffersAndTags = {
      ...PET_WATCH_OFFERS[serviceStatus],
      ...PET_WATCH_TAGS[serviceStatus],
    };

    return { petWatchOffersAndTags, membershipStatus };
  };

  const getPetWatchAvailableBenefits = () => {
    const { locale } = getSelectedPetLocale();

    // TODO improve here
    const petWatchAnnualUnavailableBenefits = null;

    const petWatchInfo = getPetServiceInfo();
    const membershipStatus = petWatchInfo?.membershipStatus ?? "Not a member";

    const PetWatchOptionsBasedOnLocale: Record<string, PetCardPetWatchProps[]> =
      {
        US: PetWatchOptionBasedOnMembershipStatus_US[
          membershipStatus as MembershipStatus
        ],
        CA: PetWatchOptionBasedOnMembershipStatus_CA[
          membershipStatus as CA_MembershipStatus
        ],
      };

    const petWatchAvailableBenefits = getBenefitsBasedOnStatus(
      PetWatchOptionsBasedOnLocale[locale]
    );

    return { petWatchAvailableBenefits, petWatchAnnualUnavailableBenefits };
  };

  const getBenefitsBasedOnStatus = (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ) => {
    const products = selectedPet?.products;

    if (
      selectedPet?.membershipStatus?.toLowerCase().includes("annual") &&
      products?.length
    ) {
      const formattedAvailableBenefits: PetCardPetWatchProps[] = [];
      console.log("formattedAvailableBenefits", formattedAvailableBenefits);

      if (products.some((item) => item.isExpired)) {
        // TODO: implement this
      }
      // TODO: colocar os casos aqui e retornar o valor
    }

    return petWatchAvailableBenefits;
  };

  console.log("selectedPet", selectedPet);

  return {
    closeReport,
    documentTypes,
    isLoading,
    lostPetHistory,
    onEditPet,
    pet: selectedPet,
    petWatchBenefits: getPetWatchAvailableBenefits(),
    petWatchInfo: getPetWatchInfo(),
    reportClosingReasons,
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
