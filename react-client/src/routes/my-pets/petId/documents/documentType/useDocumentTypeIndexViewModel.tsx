import { useNavigate, useRevalidator } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";

import { useEffect, useRef, useState } from "react";
import {
  isValidPetDocumentId,
  PetDocument,
} from "~/domain/models/pet/PetDocument";
import { PetDocumentsUseCase } from "~/domain/useCases/pet/PetDocumentsUseCase";
import { logError } from "~/infrastructure/telemetry/logUtils";
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
  const useCase = new PetDocumentsUseCase(authToken);

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

  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [uploadingNamesList, setUploadingNamesList] = useState<string[]>([]);

  const revalidator = useRevalidator();

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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
        setDownloadError(null);

        const blob = await downloadPetDocument(id);
        if (blob instanceof Blob) {
          const downloadProps: DownloadFileProps = {
            blob,
            fileName,
            fileType,
          };
          downloadFile(downloadProps);
        } else {
          logError("Downloaded content is not a Blob");
        }
      } catch (error) {
        logError("Error downloading document:", error);
        if (isMounted.current) {
          setDownloadError(
            error instanceof Error
              ? error.message
              : "Unknown error occurred during download"
          );
        }
      }
    };
  };

  const clearDownloadError = () => {
    setDownloadError(null);
  };

  const handleFileUpload = async (file: File, microchip?: string) => {
    const fileName = file.name;
    setUploadingNamesList((prev) => [...prev, fileName]);

    await uploadDocument({
      file,
      microchip,
      petId,
      type: id,
    });
    revalidator.revalidate();

    setUploadingNamesList((prev) => prev.filter((name) => name !== fileName));
  };

  const onUpload = (files: File[]) => {
    return async () => {
      const petInfo = await petInfoPromise;

      const promisesList: Promise<void>[] = [];

      files.forEach((file) => {
        const microchip = petInfo?.microchip || undefined;
        promisesList.push(handleFileUpload(file, microchip));
      });

      await Promise.allSettled(promisesList);
      revalidator.revalidate();
    };
  };

  return {
    clearDownloadError,
    documents,
    documentType,
    downloadError,
    onClose,
    onDelete,
    onDownload,
    onUpload,
    uploadingNamesList,
  };
};
