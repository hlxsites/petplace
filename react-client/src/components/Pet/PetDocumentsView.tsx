import { Meta, UppyFile } from "@uppy/core";
import { useState } from "react";
import { Text } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";
import { PetRecord } from "./types/PetRecordsTypes";
import { useUppyUploader } from "~/hooks/useUppyUploader";
import { PetDocumentsDragAndDrop } from "./PetDocumentsDragAndDrop";
import { simplifyFileType } from "~/util/fileUtil";

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
  const [file, setFile] = useState<UppyFile<Meta, Record<string, never>>>();

  const { isUploading, handleFiles } = useUppyUploader({
    onFileAdd: (file) => {
      setFile(file);
    },
  });

  return (
    <div className="grid gap-large">
      <Text color="tertiary" size="sm">
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

      <Text color="primary" size="base" fontWeight="bold">
        Upload and attach files
      </Text>

      <PetDocumentsDragAndDrop handleFiles={handleFiles} />

      {isUploading && file?.name && (
        <PetCardRecord
          record={{
            fileName: file.name,
            fileType: simplifyFileType(file.type),
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );
};
