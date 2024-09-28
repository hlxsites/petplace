import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getPetInfoUseCaseFactory from "~/domain/useCases/pet/getPetInfoUseCaseFactory";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const useCase = getPetInfoUseCaseFactory(authToken);
  const petInfoPromise = useCase.query(petId);

  return defer({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  return { ...loaderData, onEditPet };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
