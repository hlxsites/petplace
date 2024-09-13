export type PetDocumentFileTypes =
  | "doc"
  | "docx"
  | "jpg"
  | "pdf"
  | "png"
  | "txt";

// This petRecord should be permanent after downloading is implemented. Remove the type with the same name and this comment after work is done.
export type PetRecord = {
  downloadPath?: string;
  fileName: string;
  fileType?: string;
  id: string;
  recordType?: string;
};
