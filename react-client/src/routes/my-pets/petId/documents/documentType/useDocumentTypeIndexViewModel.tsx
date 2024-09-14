import { useNavigate } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";

import { isValidPetDocumentId } from "~/domain/models/pet/PetDocument";
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
  });
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const navigate = useNavigate();
  const { documents, downloadPetDocument, id } = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (documentId: string) => {
    // TODO: Implement real delete action when backend is ready
    console.log("implement delete document", documentId);
  };

  const onDownload = async (
    documentId: string,
    fileName: string,
    fileType: string
  ) => {
    try {
      const blob = await downloadPetDocument(documentId);
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

  return {
    documents,
    documentType,
    onClose,
    onDelete,
    onDownload,
  };
};
