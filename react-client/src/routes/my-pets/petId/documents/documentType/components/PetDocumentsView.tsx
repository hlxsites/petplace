import { DragAndDropFileUpload, Text, Title } from "~/components/design-system";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";
import {
  DocumentFileType,
  PetDocument,
  PetDocumentTypeId,
} from "~/domain/models/pet/PetDocument";
import { getFileExtension } from "~/util/stringUtil";

type PetDocumentViewProps = {
  documents: PetDocument[];
  documentType: PetDocumentTypeId;
  onDelete: (document: PetDocument) => () => void;
  onDownload: (document: PetDocument) => () => void;
  onUpload: (file: FileList) => () => void;
  uploadingNamesList: string[];
};

export const PetDocumentsView = ({
  documents,
  documentType,
  onDelete,
  onDownload,
  onUpload,
  uploadingNamesList,
}: PetDocumentViewProps) => {
  const isUploading = !!uploadingNamesList.length;

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

      <DragAndDropFileUpload
        ariaLabel="Upload document"
        handleFiles={onHandleFiles}
        multiple
      />

      {isUploading && (
        <div className="grid gap-small">
          {uploadingNamesList.map((name, index) => (
            <PetCardRecord
              key={`${name}_${index}`}
              document={{
                id: `${name}_${index}`,
                fileName: name,
                fileType: getFileExtension(name) as DocumentFileType,
              }}
              isUploadingFile={isUploading}
            />
          ))}
        </div>
      )}
    </div>
  );

  function onHandleFiles(files: FileList) {
    onUpload(files)();
  }
};
