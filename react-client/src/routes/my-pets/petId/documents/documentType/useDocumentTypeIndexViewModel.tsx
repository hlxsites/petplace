import { useNavigate, useRevalidator } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";

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
    petId,
    uploadDocument: useCase.uploadDocument,
  });
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const navigate = useNavigate();
  const {
    deletePetDocument,
    documents,
    downloadPetDocument,
    id,
    petId,
    uploadDocument,
  } = useLoaderData<typeof loader>();
  const { documentTypes, petInfo: petInfoPromise } = usePetProfileContext();

  const revalidator = useRevalidator();

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (documentId: PetDocument) => {
    return async () => {
      await deletePetDocument(documentId["id"]);
      revalidator.revalidate();
    };
  };

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

  const onUpload = (file: File) => {
    return async () => {
      const petInfo = await petInfoPromise;
      await uploadDocument({
        file,
        microchip: petInfo?.microchip || undefined,
        petId,
        type: id,
      });
      revalidator.revalidate();
    };
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
    onDownload,
    onUpload,
  };
};
