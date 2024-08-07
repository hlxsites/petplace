import { DownloadFileProps } from "./downloadFunctions";

type FullAcceptedFileType =
  | "image/png"
  | "image/jpeg"
  | "application/pdf"
  | "text/plain"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const fullAcceptedFileTypes: FullAcceptedFileType[] = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type FileTypeMapping = {
  [key in FullAcceptedFileType]?: DownloadFileProps['fileType'];
};

const fileTypeMapping: FileTypeMapping = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export function simplifyFileType(mimeType: string): DownloadFileProps['fileType'] | undefined {
  if (fullAcceptedFileTypes.includes(mimeType as FullAcceptedFileType)) {
    return fileTypeMapping[mimeType as FullAcceptedFileType];
  }
  return undefined;
}