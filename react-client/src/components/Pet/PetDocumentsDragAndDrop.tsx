import { useRef } from "react";
import { Button, Card, DragAndDropZone, Icon, Text } from "../design-system";

type PetDocumentsDragAndDropProps = {
  handleFiles: (files: FileList) => void;
};

export const PetDocumentsDragAndDrop = ({
  handleFiles,
}: PetDocumentsDragAndDropProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
            <Text color="tertiary-600" size="xs">
              PNG, JPG, PDF, TXT, DOC, DOCX (max 10Mb)
            </Text>
          </div>
        </Button>
      </Card>
    </DragAndDropZone>
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
