import { useCallback, useState } from "react";
import { Button, Card, Icon, Text } from "../design-system";
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

      <Card>
        <Button
          aria-label="Upload document"
          className="w-full rounded-none"
          onClick={() => setIsUploading(true)}
          variant="link"
        >
          <div className="grid place-items-center px-large py-base">
            <div className="pb-small">
              <Icon
                display="uploadCloud"
                className="text-brand-main"
                size={32}
              />
            </div>
            <Text fontFamily="raleway" fontWeight="bold" size="sm">
              Click to upload or drag and drop
            </Text>
            <Text color="tertiary-600" size="xs">
              PNG, JPG, PDF, TXT, DOC, DOCX (max 10Mb)
            </Text>
          </div>
        </Button>
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
};
