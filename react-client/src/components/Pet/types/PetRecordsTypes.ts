import { DownloadFileProps } from "~/util/downloadFunctions";

export type PetCardRecordProps = DownloadFileProps & {
  isUploadingFile?: boolean;
  onClick?: () => void;
};
