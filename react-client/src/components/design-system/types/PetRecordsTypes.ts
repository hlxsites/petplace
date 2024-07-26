export type PetCardRecordProps = {
  downloadPath?: string;
  fileName: string;
  fileType?: "doc" | "docx" | "jpg" | "pdf" | "png" | "txt";
  isUploadingFile: boolean;
  onClick?: () => void;
};
