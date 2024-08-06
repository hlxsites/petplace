import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";
import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import { LoaderData } from "~/types/LoaderData";
import { invariant, invariantResponse } from "~/util/invariant";
import { usePetProfileContext } from "../../usePetProfileLayoutViewModel";
import { isValidPetDocumentId } from "../petDocumentTypeUtils";

export const loader = (({ params }) => {
  const { documentType } = params;
  invariantResponse(
    isValidPetDocumentId(documentType),
    "Invalid document type"
  );

  return { id: documentType };
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const { id } = useLoaderData() as LoaderData<typeof loader>;
  const { documentTypes } = usePetProfileContext();
  const navigate = useNavigate();

  const documentType = documentTypes.find((dt) => dt.id === id);
  // Since the loader gave us a valid document type id, we can safely assume it's not undefined
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string, recordType: string) => {
    // Implement delete functionality when has API
    console.log(`Deleting record ${recordId} of type ${recordType}`);
  };

  const documents: PetRecord[] = [];

  return {
    documents,
    documentType,
    onClose,
    onDelete,
  };
};
