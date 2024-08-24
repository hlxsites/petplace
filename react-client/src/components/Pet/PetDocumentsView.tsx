import { useCallback } from "react";
import { Text } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";
import { PetDocumentsDragAndDrop } from "./PetDocumentsDragAndDrop";
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
  const onDeletePetCardRecord = useCallback(
    (recordType: string, recordId?: string) => {
      if (!recordId) return;
      onDelete(recordId, recordType);
    },
    [onDelete]
  );

  return (
    <div className="grid gap-large">
      <Text color="tertiary-600" size="sm">
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

      <Text color="primary-900" size="base" fontWeight="bold">
        Upload and attach files
      </Text>

      <PetDocumentsDragAndDrop handleFiles={handleFiles} />
    </div>
  );

  function handleFiles() {
    // TODO: Implement file upload
  }
};
