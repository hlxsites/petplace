import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getLostAndFoundNotificationsUseCaseFactory from "~/domain/useCases/pet/getLostAndFoundNotificationsUseCaseFactory";
import { PetCardPetWatchProps } from "~/components/Pet/PetCardPetWatch";
import { PetModel } from "~/domain/models/pet/PetModel";
import getPetInfoUseCaseFactory from "~/domain/useCases/pet/getPetInfoUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
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
  const getLostAndFoundNotificationsUseCase = getLostAndFoundNotificationsUseCaseFactory(authToken);
  const getPetInfoUseCase = getPetInfoUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const petInfoPromise = getPetInfoUseCase.query(petId);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
    mutatePetImage: postPetImageUseCase.mutate,
    lostAndFoundNotifications: getLostAndFoundNotificationsUseCase.query(petId)
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const { documentTypes, mutatePetImage, petInfo } =
    useLoaderData<typeof loader>();

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (petId: string, file: File) => {
    void mutatePetImage({ petId, petImage: file });
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
    documentTypes,
    onEditPet,
    onRemoveImage,
    onSelectImage,
    petInfo,
    petWatchBenefits: getPetWatchAvailableBenefits(),
    petWatchInfo: getPetWatchInfo(),
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
