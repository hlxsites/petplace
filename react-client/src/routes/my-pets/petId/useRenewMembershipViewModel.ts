import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import { PetModel } from "~/domain/models/pet/PetModel";
import { RenewMembershipModel } from "~/domain/models/renew/RenewMembershipModel";
import {
  CONFIRM_RENEW_PARAM_KEY,
  ITEM_PARAM_KEY,
} from "~/util/searchParamsKeys";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "./types/PetServicesTypes";
import { PET_WATCH_OFFERS, PET_WATCH_TAGS } from "./utils/petServiceConstants";
import { PET_WATCH_SERVICES_DETAILS } from "./utils/petServiceDetailsConstants";
import { getStatus } from "./utils/petServiceStatusUtils";
import {
  PET_WATCH_ANNUAL_UNAVAILABLE_OPTIONS,
  PetWatchOptionBasedOnMembershipStatus_CA,
  PetWatchOptionBasedOnMembershipStatus_US,
} from "./utils/petWatchConstants";

type UseRenewMembershipViewModelProps = {
  selectedPet: PetModel | null;
  postRenew: (data: RenewMembershipModel) => Promise<boolean>;
};

type ModalType = "error" | "renew" | "success";

export const useRenewMembershipViewModel = ({
  selectedPet,
  postRenew,
}: UseRenewMembershipViewModelProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [resultModal, setResultModal] = useState<"error" | "success" | null>(
    null
  );

  const locale = selectedPet?.locale ?? "US";

  const getPetServiceInfo = () => {
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
          onClick: openModal,
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
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(ITEM_PARAM_KEY, value);
      return nextSearchParams;
    });
  };

  const resetContent = () => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.delete(ITEM_PARAM_KEY);
      return nextSearchParams;
    });
  };

  const openModal = () => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CONFIRM_RENEW_PARAM_KEY, "renew");
      return nextSearchParams;
    });
  };

  const closeConfirmRenewModal = () => {
    setSearchParams(
      (nextSearchParams) => {
        nextSearchParams.delete(CONFIRM_RENEW_PARAM_KEY);
        return nextSearchParams;
      },
      {
        replace: true,
      }
    );
  };

  const isOpenModalType: ModalType | null = (() => {
    if (searchParams.has(CONFIRM_RENEW_PARAM_KEY)) return "renew";
    return resultModal;
  })();

  const onRenewMembership = async () => {
    const selectedContent = searchParams.get(ITEM_PARAM_KEY);
    if (!selectedContent || !selectedPet) return null;

    const response = await postRenew({
      autoRenew: true,
      id: selectedContent,
      petId: selectedPet.id,
    });

    setResultModal(response ? "success" : "error");
    closeConfirmRenewModal();
    return response;
  };

  const onCloseConfirmDialog = () => {
    setResultModal(null);
  };

  return {
    closeConfirmRenewModal,
    getContentDetails,
    handleContentChange,
    isOpenModalType,
    onRenewMembership,
    onCloseConfirmDialog,
    petWatchBenefits: getPetWatchBenefits(),
    petWatchInfo: getPetWatchInfo(),
  };
};
