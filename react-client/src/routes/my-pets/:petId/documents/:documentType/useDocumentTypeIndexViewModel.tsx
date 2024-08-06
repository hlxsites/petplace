import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";
import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import { getPetDocuments } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";
import { invariant, invariantResponse } from "~/util/invariant";
import { usePetProfileContext } from "../../usePetProfileLayoutViewModel";
import { isValidPetDocumentId } from "../petDocumentTypeUtils";

export const loader = (({ params }) => {
  const { petId, documentType } = params;
  invariantResponse(petId, "Pet id is required in this route");
  invariantResponse(
    isValidPetDocumentId(documentType),
    "Invalid document type"
  );

  return { id: documentType, petId };
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const { id, petId } = useLoaderData() as LoaderData<typeof loader>;
  const { documentTypes } = usePetProfileContext();
  const navigate = useNavigate();

  const documentType = documentTypes.find((dt) => dt.id === id);
  // Since the loader gave us a valid document type id, we can safely assume it's not undefined
  invariant(documentType, "Document type must be found here");

  const documents: PetRecord[] = getPetDocuments({ petId, type: id });

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string, recordType: string) => {
    // Implement delete functionality when has API
    console.log(`Deleting record ${recordId} of type ${recordType}`);
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
  };
};
