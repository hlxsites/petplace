import { downloadFile } from "~/util/downloadFunctions";
import { Icon, IconButton, IconKeys, Loading, Text } from "../design-system";
import { PetCardOption } from "./PetCardOption";
import { PetCardRecordProps } from "./types/PetRecordsTypes";

export const PetCardRecord = ({
  record,
  isUploadingFile,
  onDelete,
}: PetCardRecordProps) => {
  const { downloadPath, fileName, fileType } = record;

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
              onClick={handleOnDownload}
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
      text={
        <Text color="secondary-700" size="xs">
          {fileName}
        </Text>
      }
    />
  );

  function getDisplayIcon(): IconKeys {
    if (!fileType) {
      return "pdfFile";
    }
    return fileType === "docx" ? "docFile" : (`${fileType}File` as IconKeys);
  }

  function handleOnDownload() {
    downloadFile({ downloadPath, fileName, fileType }).catch((error) => {
      console.warn("Error handling the download: ", error);
    });
  }
};
