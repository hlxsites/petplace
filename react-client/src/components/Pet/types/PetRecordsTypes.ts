import { DownloadFileProps } from "~/util/downloadFunctions";

export type PetRecord = DownloadFileProps;

export type PetCardRecordProps = {
  record: PetRecord;
  isUploadingFile?: boolean;
  onDelete?: () => void;
};
