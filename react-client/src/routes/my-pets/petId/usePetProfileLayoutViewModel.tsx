import { useCallback, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
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
import putReportClosingUseCaseFactory from "~/domain/useCases/pet/putReportClosingUseCaseFactory";
import postRenewMembershipUseCaseFactory from "~/domain/useCases/renew/postRenewMembershipFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import {
  CONFIRM_RENEW_PARAM_KEY,
  ITEM_PARAM_KEY,
} from "~/util/searchParamsKeys";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "./types/PetServicesTypes";
import { useLostAndFoundReportViewModel } from "./useLostAndFoundReportViewModel";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";
import { PET_WATCH_OFFERS, PET_WATCH_TAGS } from "./utils/petServiceConstants";
import { PET_WATCH_SERVICES_DETAILS } from "./utils/petServiceDetails";
import { getStatus } from "./utils/petServiceStatusUtils";
import {
  PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS,
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
  const putReportClosingUseCase = putReportClosingUseCaseFactory(authToken);
  const renewUseCase = postRenewMembershipUseCaseFactory(authToken);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    lostAndFoundNotificationsPromise: getLostAndFoundNotificationsUseCase.query,
    mutateReport: putReportClosingUseCase.mutate,
    petId,
    petInfoPromise,
    postRenew: renewUseCase.post,
    reportClosingReasons: getReportClosingReasonsUseCase.query(),
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    documentTypes,
    lostAndFoundNotificationsPromise,
    mutateReport,
    petId,
    petInfoPromise,
    postRenew,
    reportClosingReasons,
  } = useLoaderData<typeof loader>();

  const [isLoadingPetInfo, setIsLoadingPetInfo] = useState(true);
  const [isLoadingLostPetHistory, setIsLoadingLostPetHistory] = useState(true);

  const [petInfo, setPetInfo] = useState<PetModel | null>(null);

  const [lostPetHistory, setLostPetHistory] = useState<
    LostAndFountNotification[]
  >([]);

  const isLoading = isLoadingPetInfo || isLoadingLostPetHistory;

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

  const fetchLostPetHistory = useCallback(async () => {
    setIsLoadingLostPetHistory(true);

    const lostPetHistory = await lostAndFoundNotificationsPromise(petId);
    setLostPetHistory(lostPetHistory);

    setIsLoadingLostPetHistory(false);
  }, [lostAndFoundNotificationsPromise, petId]);

  const lostAndFoundViewModel = useLostAndFoundReportViewModel({
    fetchLostPetHistory,
    mutateReport,
    pet: selectedPet,
    reportClosingReasons,
  });

  useDeepCompareEffect(() => {
    async function resolvePetInfoPromise() {
      const petInfo = await petInfoPromise;
      setPetInfo(petInfo);
      setIsLoadingPetInfo(false);
    }

    void resolvePetInfoPromise();
  }, [petInfoPromise]);

  useDeepCompareEffect(() => {
    void fetchLostPetHistory();
  }, [fetchLostPetHistory]);

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
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

  const getPetWatchBenefits = () => {
    const { locale } = getSelectedPetLocale();

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

    const petWatchAvailableBenefits = getAvailableBenefitsBasedOnStatus(
      PetWatchOptionsBasedOnLocale[locale]
    );

    const petWatchAnnualUnavailableBenefits =
      getUnavailableBenefitsBasedOnStatus(petWatchAvailableBenefits);

    return { petWatchAvailableBenefits, petWatchAnnualUnavailableBenefits };
  };

  const getAvailableBenefitsBasedOnStatus = (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ) => {
    const membershipStatus = selectedPet?.membershipStatus?.toLowerCase();
    const products = selectedPet?.products;

    const hasAnnualProduct = products?.some((product) => {
      const id = product.id.toLowerCase();
      // Fragile implementation, should be refactored to get this from the server
      return id.includes("dogs") || id.includes("cats");
    });

    // If not a member, return all benefits as is
    if (membershipStatus?.includes("not a member")) {
      return petWatchAvailableBenefits;
    }

    // If annual member with no products, return only direct-connect and recovery-specialists
    if (membershipStatus?.includes("annual")) {
      if (!products?.length || hasAnnualProduct)
        return petWatchAvailableBenefits.filter(
          (benefit) =>
            benefit.id === "direct-connect" ||
            benefit.id === "recovery-specialists"
        );
    }

    // If there are products, check for expired ones and update benefits accordingly
    if (products && products.length > 0) {
      const expiredProductIds = new Set(
        products
          .filter(
            (product): product is NonNullable<typeof product> =>
              !!product && !!product.id && product.isExpired
          )
          .map((product) => product.id)
      );

      return petWatchAvailableBenefits.map((benefit) => {
        if (benefit.id && expiredProductIds.has(benefit.id)) {
          return { ...benefit, isExpired: true };
        }
        return benefit;
      });
    }

    // Default case
    return petWatchAvailableBenefits;
  };

  const getUnavailableBenefitsBasedOnStatus = (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ) => {
    const membershipStatus = selectedPet?.membershipStatus?.toLowerCase();

    if (membershipStatus?.includes("annual")) {
      const availableBenefitIds = new Set(
        petWatchAvailableBenefits.map((benefit) => benefit.id)
      );

      return PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS.filter(
        (option) => !availableBenefitIds.has(option.id)
      );
    }
  };

  const getContentDetails = (benefits: PetCardPetWatchProps[]) => {
    const selectedContent = searchParams.get(ITEM_PARAM_KEY);
    let contentDetails = PET_WATCH_SERVICES_DETAILS.find(
      ({ id }) => id === selectedContent
    );

    const selectedBenefit = benefits.find(
      (benefit) => benefit.id === selectedContent
    );
    if (selectedBenefit && selectedBenefit.isExpired && contentDetails) {
      contentDetails = {
        ...contentDetails,
        primaryAction: {
          buttonLabel: "Renew service",
          confirmButtonLabel: "Confirm Renew",
          message: `Would you like to renew ${contentDetails.title} for another year? This ensures continued protection for your pet's.`,
          title: "Confirm Renewal",
          onClick: () => {
            openModal("renew");
          },
        },
      };
    }

    return contentDetails;
  };

  const handleContentChange = (label?: string) => {
    return () => {
      if (label) {
        setSelectedContent(label);
      } else {
        resetContent();
      }
    };
  };

  const setSelectedContent = (value: string) => {
    searchParams.set(ITEM_PARAM_KEY, value);
    setSearchParams(searchParams);
  };

  const resetContent = () => {
    searchParams.delete(ITEM_PARAM_KEY);
    setSearchParams(searchParams);
  };

  const openModal = (modalType: string) => {
    searchParams.set(CONFIRM_RENEW_PARAM_KEY, modalType);
    setSearchParams(searchParams);
  };

  const closeConfirmRenewModal = () => {
    searchParams.delete(CONFIRM_RENEW_PARAM_KEY);
    setSearchParams(searchParams);
  };

  const isConfirmRenewModalOpen = searchParams.has(CONFIRM_RENEW_PARAM_KEY);

  const onRenewMembership = async () => {
    const selectedContent = searchParams.get(ITEM_PARAM_KEY);
    if (!selectedContent) return null;

    return await postRenew({
      autoRenew: true,
      id: selectedContent,
      petId,
    });
  };

  return {
    closeConfirmRenewModal,
    documentTypes,
    getContentDetails,
    handleContentChange,
    isConfirmRenewModalOpen,
    isLoading,
    lostPetHistory,
    onEditPet,
    onRenewMembership,
    pet: selectedPet,
    petWatchBenefits: getPetWatchBenefits(),
    petWatchInfo: getPetWatchInfo(),
    ...lostAndFoundViewModel,
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
