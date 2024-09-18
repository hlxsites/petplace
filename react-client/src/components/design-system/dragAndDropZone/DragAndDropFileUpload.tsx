import { useRef } from "react";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";
import { Text } from "../text/Text";
import { DragAndDropZone } from "./DragAndDropZone";

type DragAndDropFileUploadProps = {
  ariaLabel: string;
  message?: string;
  multiple?: boolean;
  handleFiles: (files: FileList) => void;
};

export const DragAndDropFileUpload = ({
  ariaLabel,
  message,
  multiple,
  handleFiles,
}: DragAndDropFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messageText = message || "Click to upload or drag and drop";

  return (
    <DragAndDropZone
      handleFiles={handleFiles}
      className="h-fit rounded-2xl border-solid border-brand-main"
    >
      <input
        className="sr-only"
        id="drop-input"
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleInputChange}
        type="file"
      />
      <Button
        aria-label={ariaLabel}
        className="w-full rounded-none"
        onClick={handleUploadClick}
        variant="link"
      >
        <div className="grid place-items-center px-large py-base">
          <div className="pb-small">
            <Icon display="uploadCloud" className="text-brand-main" size={32} />
          </div>
          <Text fontFamily="raleway" fontWeight="bold" size="14">
            {messageText}
          </Text>
          <Text color="tertiary-600">
            PNG, JPG, PDF, TXT, DOC, DOCX (max 10Mb)
          </Text>
        </div>
      </Button>
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
