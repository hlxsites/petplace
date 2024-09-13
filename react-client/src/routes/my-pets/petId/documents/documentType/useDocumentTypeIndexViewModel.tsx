import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";

import { invariant, invariantResponse } from "~/util/invariant";
import { usePetProfileContext } from "../../usePetProfileLayoutViewModel";
import { isValidPetDocumentId } from "../petDocumentTypeUtils";
import { requireAuthToken } from "~/util/authUtil";
import { GetPetDocumentsUseCase } from "~/domain/useCases/pet/GetPetDocumentsUseCase";

export const loader = (async ({ params }) => {
  const { petId, documentType } = params;
  invariantResponse(petId, "Pet id is required in this route");
  invariantResponse(
    isValidPetDocumentId(documentType),
    "Invalid document type"
  );

  const authToken = requireAuthToken();
  const useCase = new GetPetDocumentsUseCase(authToken);

  try {
    const allDocuments = await useCase.query(petId);
    const filteredDocuments = allDocuments.filter(
      (doc) => doc.recordType?.toLowerCase() === documentType
    );

    return {
      id: documentType,
      petId,
      documents: filteredDocuments,
    };
  } catch (error) {
    console.error("Failed to fetch pet records:", error);
    // You might want to throw an error here or return a specific error state
    return {
      id: documentType,
      petId,
      documents: [],
      error: "Failed to fetch documents",
    };
  }
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const {
    id,
    documents: initialDocuments,
    error,
  } = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<PetRecord[]>(initialDocuments);

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== recordId));
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
    error,
  };
};
