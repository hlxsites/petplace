import { PetDocumentRecordType } from "~/types/PetDocumentRecordTypeEnum";

export function getPetRecordDocumentType(record?: number): string | undefined {
  const documentRecordTypeMap: Record<PetDocumentRecordType, string> = {
    [PetDocumentRecordType.MedicalRecord]: "Medical",
    [PetDocumentRecordType.Other]: "Other",
    [PetDocumentRecordType.Test]: "Tests",
    [PetDocumentRecordType.Vaccine]: "Vaccines",
  };

  return documentRecordTypeMap[record as PetDocumentRecordType] || undefined;
}
