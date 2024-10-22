import { useRef } from "react";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { classNames } from "~/util/styleUtil";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";
import { Text } from "../text/Text";
import { DragAndDropZone } from "./DragAndDropZone";

type UploadFileType = "doc" | "pdf" | "png" | "jpg" | "txt";

type DragAndDropFileUploadProps = {
  allowedFileTypes: UploadFileType[];
  allowedFileSizeLimitInMb: number;
  ariaLabel: string;
  handleFiles: (files: File[]) => void;
  id: string;
  message?: string;
  onError?: (file: File) => void;
  multiple?: boolean;
};

export const DragAndDropFileUpload = ({
  allowedFileTypes,
  allowedFileSizeLimitInMb,
  ariaLabel,
  handleFiles,
  message,
  onError,
  ...rest
}: DragAndDropFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const flexCol = useWindowWidth() < 370;

  const messageText = message || "Click to upload or drag and drop";

  const allowedFileTypesSet = new Set<string>([]);
  const acceptLabelsSet = new Set<string>([]);

  allowedFileTypes.forEach((type) => {
    const extensions = convertFromUploadFileType(type);
    extensions.forEach((extension) => {
      allowedFileTypesSet.add(extension);
    });
    acceptLabelsSet.add(extensionLabelFromUploadFileType(type));
  });

  const allowedExtensionsText = Array.from(acceptLabelsSet).join(", ");

  return (
    <DragAndDropZone
      handleFiles={handleFilesUpload}
      className="h-fit rounded-2xl border-solid border-brand-main"
    >
      <input
        accept={Array.from(allowedFileTypesSet).join(",")}
        className="sr-only"
        onChange={handleInputChange}
        ref={fileInputRef}
        type="file"
        {...rest}
      />
      <Button
        aria-label={ariaLabel}
        className="w-full rounded-none"
        onClick={handleUploadClick}
        variant="link"
      >
        <div className="flex flex-col items-center px-large py-base">
          <div className="pb-small">
            <Icon display="uploadCloud" className="text-brand-main" size={32} />
          </div>
          <Text fontFamily="raleway" fontWeight="bold" size="14">
            {messageText}
          </Text>
          <div
            className={classNames("flex", {
              "flex-col": flexCol,
            })}
          >
            <Text color="tertiary-600">{allowedExtensionsText}</Text>
            <Text color="tertiary-600">(max {allowedFileSizeLimitInMb}Mb)</Text>
          </div>
        </div>
      </Button>
    </DragAndDropZone>
  );

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      handleFilesUpload(event.target.files);
    }
  }

  function handleFilesUpload(filesList: FileList) {
    const files: File[] = [];

    Array.from(filesList).forEach((file) => {
      const isAllowedType = Array.from(allowedFileTypesSet).includes(file.type);
      const isAllowedSize = file.size <= allowedFileSizeLimitInMb * 1024 * 1024;

      if (isAllowedType && isAllowedSize) {
        files.push(file);
      } else {
        onError?.(file);
      }
    });

    handleFiles(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

function convertFromUploadFileType(type: UploadFileType): string[] {
  if (type === "doc") {
    return [
      "doc",
      ".docx",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
  }

  if (type === "jpg") return ["image/jpg", "image/jpeg"];
  if (type === "png") return ["image/png"];
  if (type === "pdf") return ["application/pdf"];
  if (type === "txt") return [".txt"];

  return [];
}

function extensionLabelFromUploadFileType(type: UploadFileType) {
  if (type === "doc") return "DOC, DOCX";
  if (type === "jpg") return "JPG, JPEG";

  return type.toUpperCase();
}
