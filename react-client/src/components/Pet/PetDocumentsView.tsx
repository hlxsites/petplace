import { useCallback, useState } from "react";
import { Card, DragAndDropFileUpload, Text } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";
import { PetRecord } from "./types/PetRecordsTypes";

type PetDocumentViewProps = {
  documents: PetRecord[];
  onDelete: (recordId: string, recordType: string) => void;
  recordType: string;
};

export const PetDocumentsView = ({
  documents,
  onDelete,
  recordType,
}: PetDocumentViewProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDeletePetCardRecord = useCallback(
    (recordType: string, recordId?: string) => {
      if (!recordId) return;
      onDelete(recordId, recordType);
    },
    [onDelete]
  );

  return (
    <div className="grid gap-large">
      <Text color="tertiary-600" size="14">
        {`View, download and manage all ${recordType} records.`}
      </Text>

      {!!documents.length && (
        <div className="grid gap-small">
          {documents.map((record) => (
            <PetCardRecord
              key={record.id}
              onDelete={() => onDeletePetCardRecord(recordType, record.id)}
              record={record}
            />
          ))}
        </div>
      )}

      <Text color="primary-900" size="16" fontWeight="bold">
        Upload and attach files
      </Text>

      <Card>
        <DragAndDropFileUpload
          ariaLabel="Upload document"
          handleFiles={handleFiles}
        />
      </Card>

      {isUploading && (
        // TODO: 81832 fix this after implementing all logic to upload documents
        <PetCardRecord
          record={{
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
