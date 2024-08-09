import {
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { getPetById, getPetServiceStatus } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";
import { invariantResponse } from "~/util/invariant";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const petInfo = getPetById(petId);
  invariantResponse(petInfo, "Pet not found", {
    status: 404,
  });
  const petServiceStatus = getPetServiceStatus(petId);

  return { documentTypes: PET_DOCUMENT_TYPES_LIST, petInfo, petServiceStatus };
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const loaderData = useLoaderData() as LoaderData<typeof loader>;

  return loaderData;
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
