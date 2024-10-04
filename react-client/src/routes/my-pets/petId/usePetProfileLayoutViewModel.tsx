import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { FormValues } from "~/components/design-system";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import { BreedModel, SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { MissingStatus, PetModel } from "~/domain/models/pet/PetModel";
import getBreedListUseCaseFactory from "~/domain/useCases/lookup/getBreedListUseCaseFactory";
import getReportClosingReasonsUseCaseFactory from "~/domain/useCases/lookup/getReportClosingReasonsUseCaseFactory";
import getSpeciesListUseCaseFactory from "~/domain/useCases/lookup/getSpeciesListUseCaseFactory";
import getLostAndFoundNotificationsUseCaseFactory from "~/domain/useCases/pet/getLostAndFoundNotificationsUseCaseFactory";
import { PutPetInfoRequest } from "~/domain/useCases/pet/PetInfoUseCase";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
import putReportClosingUseCaseFactory from "~/domain/useCases/pet/putReportClosingUseCaseFactory";
import { AppRoutePaths, PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { forceRedirect } from "~/util/redirectUtil";
import { petInfoIds } from "./form/petForm";
import { PetInfoFormVariables } from "./types/PetInfoTypes";
import {
  CA_MembershipStatus,
  MembershipStatus,
} from "./types/PetServicesTypes";
import { buildPetInfo } from "./utils/formDataUtil";
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
  const breedList = getBreedListUseCaseFactory(authToken).query();
  const speciesList = getSpeciesListUseCaseFactory(authToken).query();
  const getPetInfoUseCase = petInfoUseCaseFactory(authToken);
  const getReportClosingReasonsUseCase =
    getReportClosingReasonsUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const putReportClosingUseCase = putReportClosingUseCaseFactory(authToken);
  const petInfoPromise = getPetInfoUseCase.query(petId);

  return defer({
    breedList,
    mutateReport: putReportClosingUseCase.mutate,
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
    speciesList,
    updatePetInfo: getPetInfoUseCase.mutate,
    mutatePetImage: postPetImageUseCase.mutate,
    reportClosingReasons: getReportClosingReasonsUseCase.query(),
    lostAndFoundNotifications: getLostAndFoundNotificationsUseCase.query(petId),
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const {
    breedList,
    documentTypes,
    lostAndFoundNotifications,
    mutatePetImage,
    mutateReport,
    petInfo,
    speciesList,
    reportClosingReasons,
    updatePetInfo,
    ...rest
  } = useLoaderData<typeof loader>();
  const [missingStatus, setMissingStatus] = useState<MissingStatus>("found");

  useEffect(() => {
    async function getMissingStatus() {
      const status = await lostAndFoundNotifications;
      setMissingStatus(status[0]?.status ?? "found");
    }

    void getMissingStatus();
  }, [lostAndFoundNotifications]);

  const [petInfoVariables, setPetInfoVariables] =
    useState<PetInfoFormVariables>();

  useEffect(() => {
    async function getPetInfoFormVariables() {
      const breedVariables = await breedList;
      const speciesVariables = await speciesList;

      setPetInfoVariables({
        breedVariables,
        speciesVariables,
      });
    }

    void getPetInfoFormVariables();
  }, [breedList, speciesList]);

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (petId: string, file: File) => {
    void (async () => {
      const closed = await mutatePetImage({ petId, petImage: file });
      if (closed) forceRedirect(PET_PROFILE_FULL_ROUTE(petId));
    })();
  };

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

  const getPetWatchAvailableBenefits = async () => {
    const { locale } = await getSelectedPetAndLocale(petInfo);

    // TODO improve here
    const petWatchAnnualUnavailableBenefits = null;

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

    const petWatchAvailableBenefits = getBenefitsBasedOnStatus(
      PetWatchOptionsBasedOnLocale[locale]
    );

    return { petWatchAvailableBenefits, petWatchAnnualUnavailableBenefits };
  };

  const getBenefitsBasedOnStatus = async (
    petWatchAvailableBenefits: PetCardPetWatchProps[]
  ) => {
    const { selectedPet } = await getSelectedPetAndLocale(petInfo);
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

    console.log("petWatchAvailableBenefits", petWatchAvailableBenefits);
    console.log("selectedPet", selectedPet);

    return petWatchAvailableBenefits;
  };

  return {
    ...rest,
    closeReport,
    lostAndFoundNotifications,
    missingStatus,
    documentTypes,
    onEditPet,
    onRemoveImage,
    onSelectImage,
    getPetInfoFormData,
    onSubmitPetInfo,
    petInfo,
    petInfoVariables: getPetInfoVariables(),
    petWatchBenefits: getPetWatchAvailableBenefits(),
    petWatchInfo: getPetWatchInfo(),
    reportClosingReasons,
  };

  function closeReport(petId: string, microchip: string, reason: number) {
    void (async () => {
      const closed = await mutateReport({ petId, microchip, reason });
      if (closed) forceRedirect(PET_PROFILE_FULL_ROUTE(petId));
    })();
  }

  function onSubmitPetInfo(values: FormValues) {
    const petModel = buildPetInfo(values);
    const serverModel = convertToServerPetInfo(petModel);
    void updateAndRedirect(serverModel);
  }

  async function updateAndRedirect(data: PutPetInfoRequest) {
    const didUpdate = await updatePetInfo(data);
    if (didUpdate) navigate(PET_PROFILE_FULL_ROUTE(data.Id));
  }

  function getPetInfoFormData(values: PetModel): FormValues {
    const formValues: FormValues = {
      [petInfoIds.petId]: values.id ?? "",
      [petInfoIds.age]: values.age ?? "",
      [petInfoIds.breed]: values.breed ?? "",
      [petInfoIds.dateOfBirth]: values.dateOfBirth ?? "",
      [petInfoIds.mixedBreed]: values.mixedBreed ? "Yes" : "No",
      [petInfoIds.name]: values.name ?? "",
      [petInfoIds.neuteredSpayed]: values.spayedNeutered ? "Yes" : "No",
      [petInfoIds.sex]: values.sex === "1" ? "Male" : "Female",
      [petInfoIds.species]: values.species ?? "",
      [petInfoIds.microchip]: values.microchip ?? "",
      [petInfoIds.insurance]: (values.policyInsurance as string[])?.[0] ?? "",
    };

    return formValues;
  }

  function convertToServerPetInfo(data: PetModel): PutPetInfoRequest {
    return {
      Id: data.id,
      Name: data.name,
      Sex: data.sex === "Male" ? "1" : "2",
      DateOfBirth: data.dateOfBirth ?? "",
      Neutered: !!data.spayedNeutered,
      SpeciesId:
        petInfoVariables?.speciesVariables.find(
          ({ name }) => data.species === name
        )?.id ?? 1,
      BreedId:
        // @ts-expect-error the ? check seems not to be resolving the undefined possibility for the next line
        petInfoVariables?.breedVariables.find(({ name }) => data.breed === name)
          .id ?? 0,
      MixedBreed: !!data.mixedBreed,
    };
  }

  function getPetInfoVariables() {
    return {
      breedOptions: convertToLabels(petInfoVariables?.breedVariables ?? []),
      speciesOptions: convertToLabels(petInfoVariables?.breedVariables ?? []),
    };
  }

  function convertToLabels(list: (BreedModel | SpeciesModel)[]) {
    return list.map(({ name }) => name);
  }
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
