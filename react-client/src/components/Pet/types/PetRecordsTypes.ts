export type PetRecord = {
  downloadPath?: string;
  fileName: string;
  fileType?: "doc" | "docx" | "jpg" | "pdf" | "png" | "txt";
};

export type PetCardRecordProps = {
  record: PetRecord;
  isUploadingFile?: boolean;
  onDelete?: () => void;
};
