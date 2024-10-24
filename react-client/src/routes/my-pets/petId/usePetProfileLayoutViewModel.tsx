import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
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

import { useLostAndFoundReportViewModel } from "./useLostAndFoundReportViewModel";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";

import { useRenewMembershipViewModel } from "./useRenewMembershipViewModel";
import { useMyPetsContext } from "../useMyPetsIndexViewModel";
import { logError } from "~/infrastructure/telemetry/logUtils";

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

  const { petsPromise } = useMyPetsContext();

  useEffect(() => {
    const getPetPointSelectedPet = () =>
      petsPromise
        .then((pets) => pets.find((pet) => pet.id === petId))
        .catch((error) => logError("Failed to get PetPoint info", error));

    const fetchPetInfo = async () => {
      if (petInfo?.sourceType === "PetPoint") {
        try {
          const petPointPetInfo = (await getPetPointSelectedPet()) ?? null;
          setPetInfo(petPointPetInfo);
        } catch (error) {
          logError("Failed to set PetPoint info", error);
        }
      }
    };

    void fetchPetInfo();
  }, [petInfo?.sourceType, petId, petsPromise]);

  const isLoading = isLoadingPetInfo || isLoadingLostPetHistory;

  const missingStatus: MissingStatus = (() => {
    // If the server provided the status, use it
    if (petInfo?.missingStatus && petInfo.missingStatus !== "unknown") {
      return petInfo.missingStatus;
    }

    // Otherwise, fallback to the latest lost pet history entry

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

  const renewMembershipViewModel = useRenewMembershipViewModel({
    selectedPet,
    postRenew,
  });

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

  return {
    documentTypes,
    isLoading,
    lostPetHistory,
    onEditPet,
    pet: selectedPet,
    petId,
    ...lostAndFoundViewModel,
    ...renewMembershipViewModel,
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
