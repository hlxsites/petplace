import { useState } from "react";
import { Button, Card, Icon, Text } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";
import { PetRecord } from "./types/PetRecordsTypes";

type PetDocumentViewProps = {
  documents: PetRecord[];
  onDelete: () => void;
  recordType: string;
};

export const PetDocumentsView = ({
  documents,
  onDelete,
  recordType,
}: PetDocumentViewProps) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="grid gap-large">
      <Text color="text-tertiary-600" size="sm">
        {`View, download and manage all ${recordType} records.`}
      </Text>

      <div className="grid gap-small">
        {documents.map((record) => (
          <PetCardRecord
            key={record.fileName}
            onDelete={onDelete}
            record={record}
          />
        ))}
      </div>

      <Text color="text-primary-900" size="base" fontWeight="bold">
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
            <Text color="text-tertiary-600" size="xs">
              PNG, JPG, PDF, TXT, DOC, DOCX (max 10Mb)
            </Text>
          </div>
        </Button>
      </Card>

      {isUploading && (
        // TODO: 81832 fix this after implementing all logic to upload documents
        <PetCardRecord
          record={{ fileName: "WIP - testing purposes", fileType: "doc" }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );
};
