import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { getPetServiceStatus } from "~/mocks/MockRestApiServer";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { LoaderData } from "~/types/LoaderData";
import { invariantResponse } from "~/util/invariant";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";
import { GetPetInfoUseCase } from "~/domain/useCases/pet/GetPetInfoUseCase";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (async ({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const useCase = new GetPetInfoUseCase(authToken);

  const petInfo = await useCase.query(petId);
  invariantResponse(petInfo, "Pet not found", {
    status: 404,
  });
  const petServiceStatus = getPetServiceStatus(petId);

  return { documentTypes: PET_DOCUMENT_TYPES_LIST, petInfo, petServiceStatus };
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData<typeof loader>;

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  return { ...loaderData, onEditPet };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
