import {
  Card,
  Icon,
  IconButton,
  IconKeys,
  Loading,
  Text,
} from "../design-system";
import { PetCardRecordProps } from "../design-system/types/PetRecordsTypes";

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
            <a
              aria-label="download file"
              download={fileName}
              href={downloadPath}
              rel="noopener noreferrer"
            >
              <Icon
                display="download"
                className="text-orange-300-contrast"
                size={16}
              />
            </a>
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
};
