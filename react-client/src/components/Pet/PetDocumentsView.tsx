import { useState } from "react";
import {
  DocumentFileType,
  PetDocument,
  PetDocumentTypeId,
} from "~/domain/models/pet/PetDocument";
import { getFileExtension } from "~/util/stringUtil";
import { Card, DragAndDropFileUpload, Text, Title } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";

type PetDocumentViewProps = {
  documents: PetDocument[];
  documentType: PetDocumentTypeId;
  onDelete: (document: PetDocument) => () => void;
  onDownload: (document: PetDocument) => () => void;
  onUpload: (file: File) => () => void;
};

export const PetDocumentsView = ({
  documents,
  documentType,
  onDelete,
  onDownload,
  onUpload,
}: PetDocumentViewProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileNameUploading, setFileNameUploading] = useState<string>("");

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

      <Card>
        <DragAndDropFileUpload
          ariaLabel="Upload document"
          handleFiles={onHandleFiles} // Attach the corrected handler
        />
      </Card>

      {isUploading && (
        <PetCardRecord
          document={{
            id: "test-record",
            fileName: fileNameUploading ?? "",
            fileType: getFileExtension(fileNameUploading) as DocumentFileType,
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );

  function onHandleFiles(files: FileList) {
    setIsUploading(true);

    const uploadPromises = Array.from(files).map((file) => {
      setFileNameUploading(file.name);
      return new Promise<void>((resolve) => {
        onUpload(file);
        resolve();
      });
    });

    Promise.all(uploadPromises)
      .then(() => {
        setIsUploading(false);
        setFileNameUploading("");
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        setIsUploading(false);
        setFileNameUploading("");
      });
  }
};
