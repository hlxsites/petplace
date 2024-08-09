import { DownloadFileProps } from "~/util/downloadFunctions";

export type PetRecord = DownloadFileProps & {
  id: string;
};

export type PetCardRecordProps = {
  record: PetRecord;
  isUploadingFile?: boolean;
  onDelete?: () => void;
};
