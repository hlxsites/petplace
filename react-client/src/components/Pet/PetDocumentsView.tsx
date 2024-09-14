import { useState } from "react";
import { PetDocument } from "~/domain/models/pet/PetDocument";
import { Card, DragAndDropFileUpload, Text, Title } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";

type PetDocumentViewProps = {
  documents: PetDocument[];
  documentType: string;
  onDelete: (document: PetDocument) => () => void;
  onDownload: (document: PetDocument) => () => void;
};

export const PetDocumentsView = ({
  documents,
  documentType,
  onDelete,
  onDownload,
}: PetDocumentViewProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
          handleFiles={handleFiles}
        />
      </Card>

      {isUploading && (
        <PetCardRecord
          document={{
            id: "test-record",
            fileName: "WIP - testing purposes",
            fileType: "doc",
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );

  function handleFiles() {
    // TODO: Implement file upload
    setIsUploading(true);
  }
};
