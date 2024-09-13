import { z } from "zod";
import { PetDocumentTypeId } from "~/domain/models/pet/PetDocument";
import { PetRecord } from "~/domain/models/pet/PetRecords";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetDocumentsRepository } from "~/domain/repository/pet/GetPetDocumentsRepository";
import { getFileExtension } from "~/util/stringUtil";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetPetDocumentsUseCase implements GetPetDocumentsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  private handleError(error: unknown): [] {
    console.error("GetPetDocumentsUseCase query error", error);
    return [];
  }

  async query(petId: string, type: PetDocumentTypeId): Promise<PetRecord[]> {
    try {
      const result = await this.httpClient.get(`Pet/${petId}/documents`);

      if (!result.data) return [];

      const allDocuments = convertToPetDocuments(result.data);

      return allDocuments.filter(
        (doc) => doc.recordType?.toLowerCase() === type
      );
    } catch (error) {
      return this.handleError(error);
    }
  }
}

function convertToPetDocuments(data: unknown): PetRecord[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    Id: z.string(),
    ContentType: z.string(),
    DocumentType: z.number(),
    PetId: z.string(),
    Name: z.string(),
  });

  const documents: PetRecord[] = [];

  data.forEach((petData) => {
    const petDocument = parseData(serverResponseSchema, petData);

    if (!petDocument) return;

    documents.push({
      downloadPath: petDocument.Id,
      fileName: petDocument.Name,
      fileType: getFileExtension(petDocument.Name),
      id: petDocument.Id,
      recordType: getPetRecordDocumentType(petDocument.DocumentType),
    });
  });

  return documents;
}

export enum PetDocumentRecordType {
  MedicalRecord = 1,
  Vaccine = 2,
  Test = 3,
  Other = 1024,
}

function getPetRecordDocumentType(record?: number): string | undefined {
  const documentRecordTypeMap: Record<PetDocumentRecordType, string> = {
    [PetDocumentRecordType.MedicalRecord]: "Medical",
    [PetDocumentRecordType.Other]: "Other",
    [PetDocumentRecordType.Test]: "Tests",
    [PetDocumentRecordType.Vaccine]: "Vaccines",
  };

  return documentRecordTypeMap[record as PetDocumentRecordType] || undefined;
}
