import { Meta, UppyFile } from "@uppy/core";
import { useCallback, useState } from "react";
import { useUppyUploader } from "~/hooks/useUppyUploader";
import { simplifyFileType } from "~/util/fileUtil";
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
  const [file, setFile] = useState<UppyFile<Meta, Record<string, never>>>();

  const { isUploading, handleFiles } = useUppyUploader({
    onFileAdd: (file) => {
      setFile(file);
    },
  });

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

      {isUploading && file?.name && (
        <PetCardRecord
          record={{
            fileName: file.name,
            fileType: simplifyFileType(file.type),
            id: "test-record",
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );
};
