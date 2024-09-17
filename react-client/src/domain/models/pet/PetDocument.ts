const PET_DOCUMENT_TYPE_IDS = [
  "medical",
  "vaccines",
  "tests",
  "other",
] as const;
export type PetDocumentTypeId = (typeof PET_DOCUMENT_TYPE_IDS)[number];

export const isValidPetDocumentId = (a: unknown): a is PetDocumentTypeId => {
  return PET_DOCUMENT_TYPE_IDS.indexOf(a as PetDocumentTypeId) !== -1;
};

export type DocumentFileType =
  | "doc"
  | "docx"
  | "pdf"
  | "png"
  | "jpg"
  | "jpeg"
  | "txt";

export type PetDocument = {
  fileName: string;
  fileType: DocumentFileType;
  id: string;
};

export type UploadDocumentType = {
  file: File;
  microchip?: string;
  petId?: string;
  type: number;
};
