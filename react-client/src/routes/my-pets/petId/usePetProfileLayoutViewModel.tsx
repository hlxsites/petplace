import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getLostAndFoundNotificationsUseCaseFactory from "~/domain/useCases/pet/getLostAndFoundNotificationsUseCaseFactory";
import getPetInfoUseCaseFactory from "~/domain/useCases/pet/getPetInfoUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";
import { MissingStatus } from "~/domain/models/pet/PetModel";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const getLostAndFoundNotificationsUseCase =
    getLostAndFoundNotificationsUseCaseFactory(authToken);
  const getPetInfoUseCase = getPetInfoUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const petInfoPromise = getPetInfoUseCase.query(petId);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
    mutatePetImage: postPetImageUseCase.mutate,
    lostAndFoundNotifications: getLostAndFoundNotificationsUseCase.query(petId),
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const { lostAndFoundNotifications, mutatePetImage, ...rest } =
    useLoaderData<typeof loader>();
  const [missingStatus, setMissingStatus] = useState<MissingStatus>("found");

  useEffect(() => {
    async function getMissingStatus() {
      const status = await lostAndFoundNotifications;
      setMissingStatus(status[status.length - 1]?.status ?? "found");
    }

    void getMissingStatus();
  }, [lostAndFoundNotifications]);

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (petId: string, file: File) => {
    void mutatePetImage({ petId, petImage: file });
  };

  return {
    ...rest,
    lostAndFoundNotifications,
    missingStatus,
    onEditPet,
    onRemoveImage,
    onSelectImage,
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
