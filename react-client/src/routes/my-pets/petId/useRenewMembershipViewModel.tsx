import { useOutletContext, useSearchParams } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import { PetModel } from "~/domain/models/pet/PetModel";
import getPetInfoUseCaseFactory from "~/domain/useCases/pet/getPetInfoUseCaseFactory";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "./types/PetServicesTypes";
import { PET_WATCH_OFFERS, PET_WATCH_TAGS } from "./utils/petServiceConstants";
import { getStatus } from "./utils/petServiceStatusUtils";
import {
  PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS,
  PetWatchOptionBasedOnMembershipStatus_CA,
  PetWatchOptionBasedOnMembershipStatus_US,
} from "./utils/petWatchConstants";
import {
  CONFIRM_RENEW_PARAM_KEY,
  ITEM_PARAM_KEY,
} from "~/util/searchParamsKeys";
import { PET_WATCH_SERVICES_DETAILS } from "./utils/petServiceDetailsConstants";
import postRenewMembershipUseCaseFactory from "~/domain/useCases/renew/postRenewMembershipFactory";
import { RenewDialogDetails } from "./utils/renewServiceConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();

  const renewUseCase = postRenewMembershipUseCaseFactory(authToken);
  const getPetInfoUseCase = getPetInfoUseCaseFactory(authToken);

  const petInfoPromise = getPetInfoUseCase.query(petId);

  return defer({
    petInfo: petInfoPromise,
    postRenew: renewUseCase.post,
    petId,
  });
}) satisfies LoaderFunction;

export const useRenewMembershipViewModel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { petInfo, petId, postRenew } = useLoaderData<typeof loader>();

  const getSelectedPetAndLocale = async (petInfo: Promise<PetModel | null>) => {
    const selectedPet = await petInfo;
    const locale = selectedPet?.locale ?? "US"; //

    return { selectedPet, locale };
  };

  const getPetServiceInfo = async () => {
    const { selectedPet, locale } = await getSelectedPetAndLocale(petInfo);

    const membershipStatus = selectedPet?.membershipStatus;

    // Safe guard to avoid inconsistencies from the API bringing annual membership for Canadian animals
    if (
      membershipStatus?.toLocaleLowerCase().includes("annual") &&
      locale === "CA"
    )
      return { membershipStatus: null, serviceStatus: null };

    const petProducts = selectedPet?.products;

    const serviceStatus = getStatus({
      products: petProducts,
      locale,
      membershipStatus,
    });

    return { membershipStatus, serviceStatus };
  };

  const getPetWatchInfo = async () => {
    const { membershipStatus, serviceStatus } = await getPetServiceInfo();

    if (serviceStatus === null) {
      return { petWatchOffersAndTags: null, membershipStatus };
    }

    const petWatchOffersAndTags = {
      ...PET_WATCH_OFFERS[serviceStatus],
      ...PET_WATCH_TAGS[serviceStatus],
    };

    return { petWatchOffersAndTags, membershipStatus };
  };

  const getPetWatchBenefits = async () => {
    const { locale } = await getSelectedPetAndLocale(petInfo);

    const petWatchInfo = await getPetServiceInfo();
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

    const petWatchAvailableBenefits = await getAvailableBenefitsBasedOnStatus(
      PetWatchOptionsBasedOnLocale[locale]
    );

    const petWatchAnnualUnavailableBenefits =
      await getUnavailableBenefitsBasedOnStatus(petWatchAvailableBenefits);

    return { petWatchAvailableBenefits, petWatchAnnualUnavailableBenefits };
  };

  const getAvailableBenefitsBasedOnStatus = async (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ): Promise<PetCardPetWatchProps[]> => {
    const { selectedPet } = await getSelectedPetAndLocale(petInfo);
    const membershipStatus = selectedPet?.membershipStatus?.toLowerCase();
    const products = selectedPet?.products;
    const hasAnnualProduct = products?.some(
      (product) =>
        product.id.toLocaleLowerCase().includes("dogs") ||
        product.id.toLocaleLowerCase().includes("cats")
    );

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

  const getUnavailableBenefitsBasedOnStatus = async (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ) => {
    const { selectedPet } = await getSelectedPetAndLocale(petInfo);
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

    const result = await postRenew({
      autoRenew: true,
      id: selectedContent,
      petId,
    });

    return RenewDialogDetails[result ? "success" : "error"];
  };

  return {
    closeConfirmRenewModal,
    getContentDetails,
    handleContentChange,
    isConfirmRenewModalOpen,
    onRenewMembership,
    petInfo,
    petWatchBenefits: getPetWatchBenefits(),
    petWatchInfo: getPetWatchInfo(),
  };
};

export const useRenewMembershipContext = () =>
  useOutletContext<ReturnType<typeof useRenewMembershipViewModel>>();
