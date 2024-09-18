import { useState, useEffect } from "react";
import { DragAndDropFileUpload, Text, Title } from "~/components/design-system";
import { ErrorDialog } from "~/components/design-system/dialog/ErrorDialog";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";
import {
  DocumentFileType,
  PetDocument,
  PetDocumentTypeId,
} from "~/domain/models/pet/PetDocument";
import { getFileExtension } from "~/util/stringUtil";

type PetDocumentViewProps = {
  clearDownloadError: () => void;
  documents: PetDocument[];
  documentType: PetDocumentTypeId;
  downloadError: string | null;
  onDelete: (document: PetDocument) => () => void;
  onDownload: (document: PetDocument) => () => void;
  onUpload: (file: FileList) => () => void;
  uploadingNamesList: string[];
};

export const PetDocumentsView = ({
  clearDownloadError,
  documents,
  documentType,
  downloadError,
  onDelete,
  onDownload,
  onUpload,
  uploadingNamesList,
}: PetDocumentViewProps) => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorType, setErrorType] = useState<"upload" | "download" | null>(
    null
  );

  const isUploading = !!uploadingNamesList.length;

  const errorDialogContent = {
    upload: {
      message:
        "We couldn't upload your pet's document. Please check your file and try again. If the problem persists, ensure your file is in a supported format and size.",
      title: "Document Upload Failed",
    },
    download: {
      message:
        "We're having trouble downloading your pet's document. This could be due to a temporary server issue or a problem with the file. Please try again later.",
      title: "Document Download Failed",
    },
  };

  useEffect(() => {
    if (downloadError) {
      setErrorType("download");
      setIsErrorDialogOpen(true);
    }
  }, [downloadError]);

  const handleCloseErrorDialog = () => {
    clearDownloadError();
    setIsErrorDialogOpen(false);
    setErrorType(null);
    setIsErrorDialogOpen(false);
  };

  return (
    <div className="grid gap-large">
      <Text color="tertiary-600" size="14">
        {`View, download and manage all ${documentType} records.`}
      </Text>

      {!!documents.length && (
        <div className="grid gap-small">
          {documents.map((document) => (
            <PetCardRecord
              document={document}
              key={document.id}
              onDelete={onDelete(document)}
              onDownload={onDownload(document)}
            />
          ))}
        </div>
      )}

      <Title color="primary-900" level="h5">
        Upload and attach files
      </Title>

      <DragAndDropFileUpload
        ariaLabel="Upload document"
        handleFiles={onHandleFiles}
        multiple
      />

      {isUploading && (
        <div className="grid gap-small">
          {uploadingNamesList.map((name, index) => (
            <PetCardRecord
              key={`${name}_${index}`}
              document={{
                id: `${name}_${index}`,
                fileName: name,
                fileType: getFileExtension(name) as DocumentFileType,
              }}
              isUploadingFile={isUploading}
            />
          ))}
        </div>
      )}

      {errorType && (
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          onClose={handleCloseErrorDialog}
          message={errorDialogContent[errorType].message}
          title={errorDialogContent[errorType].title}
        />
      )}
    </div>
  );

  function onHandleFiles(files: FileList) {
    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      setErrorType("upload");
      setIsErrorDialogOpen(true);
      return;
    }

    onUpload(validFiles as unknown as FileList)();
  }
};
