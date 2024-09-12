import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import { getPetDocuments } from "~/mocks/MockRestApiServer";
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
  const { id, petId } = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<PetRecord[]>([]);

  const documentType = documentTypes.find((dt) => dt.id === id);
  // Since the loader gave us a valid document type id, we can safely assume it's not undefined
  invariant(documentType, "Document type must be found here");

  useEffect(() => {
    setDocuments(getPetDocuments({ petId, type: id }));
  }, [petId, id, setDocuments]);

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string) => {
    // TODO: Implement real delete action when backend is ready
    setDocuments((prev) => prev.filter((doc) => doc.id !== recordId));
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
  };
};
