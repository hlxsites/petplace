import { PetDocumentRecordType } from "~/types/PetDocumentRecordTypeEnum";

export function getPetRecordDocumentType(record?: number): string | undefined {
  const documentRecordTypeMap: Record<PetDocumentRecordType, string> = {
    [PetDocumentRecordType.MedicalRecord]: "medical-records",
    [PetDocumentRecordType.Other]: "other",
    [PetDocumentRecordType.Test]: "tests",
    [PetDocumentRecordType.Vaccine]: "vaccines",
  };

  return documentRecordTypeMap[record as PetDocumentRecordType] || undefined;
}
