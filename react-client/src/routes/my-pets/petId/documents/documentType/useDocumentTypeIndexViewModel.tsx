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
    petId,
    documents: useCase.query(petId, documentType),
    downloadPetDocument: (documentId: string) =>
      useCase.fetchDocumentBlob(documentId),
  });
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();

  const documentType = documentTypes.find((dt) => dt.id === loaderData.id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string) => {
    // TODO: Implement real delete action when backend is ready
    console.log("recordId", recordId);
  };

  const onDownload = async (
    documentId: string,
    fileName: string,
    fileType: string
  ) => {
    try {
      const blob = await loaderData.downloadPetDocument(documentId);
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
    ...loaderData,
    documentType,
    onClose,
    onDelete,
    onDownload,
  };
};
