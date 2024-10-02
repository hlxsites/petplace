import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getPetInfoUseCaseFactory from "~/domain/useCases/pet/getPetInfoUseCaseFactory";
import getReportClosingReasonsUseCaseFactory from "~/domain/useCases/lookup/getReportClosingReasonsUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const getPetInfoUseCase = getPetInfoUseCaseFactory(authToken);
  const getReportClosingReasonsUseCase = getReportClosingReasonsUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const petInfoPromise = getPetInfoUseCase.query(petId);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
    mutatePetImage: postPetImageUseCase.mutate,
    reportClosingReasons: getReportClosingReasonsUseCase.query(),
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const { mutatePetImage, ...rest } = useLoaderData<typeof loader>();

  function closeReport (petId: string, reasonId: number){
    console.log("🚀 ~ petId, reasonId", petId, reasonId)
  }

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (petId: string, file: File) => {
    void mutatePetImage({ petId, petImage: file });
  };

  return { ...rest, onEditPet, onRemoveImage, onSelectImage, closeReport };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
