import { downloadFile } from "~/util/downloadFunctions";
import {
  Card,
  Icon,
  IconButton,
  IconKeys,
  Loading,
  Text,
} from "../design-system";
import { PetCardRecordProps } from "./types/PetRecordsTypes";

export const PetCardRecord = ({
  downloadPath,
  fileName,
  fileType,
  isUploadingFile,
  onClick,
}: PetCardRecordProps) => {
  return (
    <Card role="listitem">
      <div className="flex justify-between p-base">
        <div className="flex items-center gap-small">
          <Icon className="text-neutral-white" display={getDisplayIcon()} />

          <Text color="secondary" size="xs">
            {fileName}
          </Text>
        </div>
        {isUploadingFile ? (
          <Loading />
        ) : (
          <div className="flex items-center">
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
              onClick={onClick}
              variant="link"
            />
          </div>
        )}
      </div>
    </Card>
  );

  function getDisplayIcon(): IconKeys {
    if (!fileType) {
      return "pdfFile";
    }

    return fileType === "docx" ? "docFile" : `${fileType}File`;
  }

  function handleOnDownload() {
    downloadFile({ downloadPath, fileName, fileType }).catch((error) => {
      console.warn("Error handling the download: ", error);
    });
  }
};
