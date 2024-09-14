import { PetDocument } from "~/domain/models/pet/PetDocument";
import { Icon, IconButton, IconKeys, Loading, Text } from "../design-system";
import { PetCardOption } from "./PetCardOption";

type PetCardRecordProps = {
  document: PetDocument;
  isUploadingFile?: boolean;
  onDelete?: () => void;
  onDownload?: () => void;
};

export const PetCardRecord = ({
  document,
  isUploadingFile,
  onDelete,
  onDownload,
}: PetCardRecordProps) => {
  const { fileType, fileName } = document;

  return (
    <PetCardOption
      actionButton={
        isUploadingFile ? (
          <Loading />
        ) : (
          <>
            <IconButton
              label="download file"
              icon="download"
              iconProps={{
                className: "text-orange-300-contrast lg:mr-[-8px]",
                size: 16,
              }}
              onClick={() => onDownload}
              variant="link"
            />
            <IconButton
              label="delete file"
              icon="trash"
              iconProps={{ className: "text-orange-300-contrast", size: 16 }}
              onClick={onDelete}
              variant="link"
            />
          </>
        )
      }
      iconLeft={
        <Icon className="text-neutral-white" display={getDisplayIcon()} />
      }
      text={<Text color="secondary-700">{fileName}</Text>}
    />
  );

  function getDisplayIcon(): IconKeys {
    if (!fileType) {
      return "pdfFile";
    }
    return fileType === "docx" ? "docFile" : (`${fileType}File` as IconKeys);
  }
};
