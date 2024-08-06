import { downloadFile, DownloadFileProps } from "~/util/downloadFunctions";
import { PetCardRecordProps } from "./types/PetRecordsTypes";
import { PetCardOption } from "./PetCardOption";
import { Icon, IconButton, IconKeys, Loading, Text } from "../design-system";

export const PetCardRecord = ({
  record,
  isUploadingFile,
  onDelete,
}: PetCardRecordProps) => {
  const { downloadPath, fileName, fileType } = record;

  const displayIcon: IconKeys = getDisplayIcon(fileType);

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
              onClick={() =>
                handleOnDownload({ downloadPath, fileName, fileType })
              }
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
      iconLeft={<Icon className="text-neutral-white" display={displayIcon} />}
      text={
        <Text color="text-secondary-700" size="xs">
          {fileName}
        </Text>
      }
    />
  );
};

function getDisplayIcon(fileType?: string): IconKeys {
  if (!fileType) {
    return "pdfFile";
  }
  return fileType === "docx" ? "docFile" : (`${fileType}File` as IconKeys);
}

function handleOnDownload({
  downloadPath,
  fileName,
  fileType,
}: DownloadFileProps) {
  downloadFile({ downloadPath, fileName, fileType }).catch((error) => {
    console.warn("Error handling the download: ", error);
  });
}
