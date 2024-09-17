import { useState } from "react";
import {
  DocumentFileType,
  PetDocument,
  PetDocumentTypeId,
  UploadDocumentType,
} from "~/domain/models/pet/PetDocument";
import { PetDocumentRecordType } from "~/domain/useCases/pet/GetPetDocumentsUseCase";
import { getFileExtension } from "~/util/stringUtil";
import { Card, DragAndDropFileUpload, Text, Title } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";

type PetDocumentViewProps = {
  documents: PetDocument[];
  documentType: PetDocumentTypeId;
  onDelete: (document: PetDocument) => () => void;
  onDownload: (document: PetDocument) => () => void;
  onUpload: (document: UploadDocumentType) => () => void;
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

  const documentTypeAsNumber = (() => {
    const mapper: Record<PetDocumentTypeId, PetDocumentRecordType> = {
      medical: PetDocumentRecordType.MedicalRecord,
      other: PetDocumentRecordType.Other,
      tests: PetDocumentRecordType.Test,
      vaccines: PetDocumentRecordType.Vaccine,
    };

    return mapper[documentType] || PetDocumentRecordType.Other;
  })();

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
      const uploadDocument: UploadDocumentType = {
        file,
        type: documentTypeAsNumber,
      };

      return new Promise<void>((resolve) => {
        const uploadFn = onUpload(uploadDocument);
        uploadFn();
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
