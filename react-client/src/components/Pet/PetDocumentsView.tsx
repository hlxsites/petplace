import { Meta, UppyFile } from "@uppy/core";
import { useRef, useState } from "react";
import { Button, Card, DragAndDropZone, Icon, Text } from "../design-system";
import { PetCardRecord } from "./PetCardRecord";
import { PetRecord } from "./types/PetRecordsTypes";
import { useUppyUploader } from "~/hooks/useUppyUploader";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      <DragAndDropZone
        handleFiles={handleFiles}
        className="rounded-2xl border-solid border-brand-main"
      >
        <input
          id="drop-input"
          ref={fileInputRef}
          className="sr-only"
          type="file"
          onChange={handleInputChange}
        />
        <Card>
          <Button
            aria-label="Upload document"
            className="w-full rounded-none"
            onClick={handleUploadClick}
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
              <Text color="tertiary" size="xs">
                PNG, JPG, PDF, TXT, DOC, DOCX (max 10Mb)
              </Text>
            </div>
          </Button>
        </Card>
      </DragAndDropZone>

      {isUploading && typeof file?.name !== "undefined" && (
        // TODO: 81832 fix this after implementing all logic to upload documents
        <PetCardRecord
          record={{ fileName: file.name, fileType: "pdf" }}
          isUploadingFile={isUploading}
        />
      )}

      <div id="uppy-dashboard"></div>
    </div>
  );

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  }
};
