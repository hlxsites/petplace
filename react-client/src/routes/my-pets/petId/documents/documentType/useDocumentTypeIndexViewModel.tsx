import { useNavigate } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { useState, useCallback, useEffect } from "react";

import {
  isValidPetDocumentId,
  PetDocument,
} from "~/domain/models/pet/PetDocument";
import { GetPetDocumentsUseCase } from "~/domain/useCases/pet/GetPetDocumentsUseCase";
import { requireAuthToken } from "~/util/authUtil";
import { downloadFile, DownloadFileProps } from "~/util/downloadFunctions";
import { invariant, invariantResponse } from "~/util/invariant";
import { usePetProfileContext } from "../../usePetProfileLayoutViewModel";

export const loader = (({ params }) => {
  const { petId, documentType } = params;
  invariantResponse(petId, "Pet id is required in this route");
  invariantResponse(
    isValidPetDocumentId(documentType),
    "Invalid document type"
  );

  const authToken = requireAuthToken();
  const useCase = new GetPetDocumentsUseCase(authToken);

  return defer({
    id: documentType,
    documents: useCase.query(petId, documentType),
    downloadPetDocument: useCase.fetchDocumentBlob,
    deletePetDocument: useCase.deleteDocument,
    reFetchDocuments: () => useCase.query(petId, documentType),
  });
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const navigate = useNavigate();
  const {
    deletePetDocument,
    documents: initialDocuments,
    downloadPetDocument,
    id,
    reFetchDocuments,
  } = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();

  const [documents, setDocuments] = useState<PetDocument[]>([]);

  useEffect(() => {
    initialDocuments.then(setDocuments);
  }, [initialDocuments]);

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = useCallback(
    (documentId: PetDocument) => {
      return async () => {
        try {
          const isDeleted = await deletePetDocument(documentId["id"]);

          if (isDeleted) {
            const updatedDocuments = await reFetchDocuments();
            setDocuments(updatedDocuments);
          } else {
            console.error("Failed to delete document");
          }
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      };
    },
    [deletePetDocument, reFetchDocuments]
  );

  const onDownload = ({ id, fileName, fileType }: PetDocument) => {
    return async () => {
      try {
        const blob = await downloadPetDocument(id);
        if (blob instanceof Blob) {
          const downloadProps: DownloadFileProps = {
            blob,
            fileName,
            fileType,
          };
          downloadFile(downloadProps);
        } else {
          console.error("Downloaded content is not a Blob");
        }
      } catch (error) {
        console.error("Error downloading document:", error);
      }
    };
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
    onDownload,
  };
};
