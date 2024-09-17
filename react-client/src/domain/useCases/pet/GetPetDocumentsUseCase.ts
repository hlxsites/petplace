import { z } from "zod";
import {
  PetDocument,
  PetDocumentTypeId,
} from "~/domain/models/pet/PetDocument";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetDocumentsRepository } from "~/domain/repository/pet/GetPetDocumentsRepository";
import { getFileExtension } from "~/util/stringUtil";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

const DOCUMENT_BASE_URL = "api/Document";

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

  query = async (
    petId: string,
    type: PetDocumentTypeId
  ): Promise<PetDocument[]> => {
    try {
      const result = await this.httpClient.get(`api/Pet/${petId}/documents`);

      if (!result.data) return [];

      const allDocuments = convertToPetDocuments(result.data);

      return allDocuments.filter((doc) => doc.type?.toLowerCase() === type);
    } catch (error) {
      return this.handleError(error);
    }
  };

  fetchDocumentBlob = async (documentId: string): Promise<Blob | null> => {
    try {
      const result = await this.httpClient.get(
        `${DOCUMENT_BASE_URL}/${documentId}`,
        {
          responseType: "blob",
        }
      );

      if (result.error || !result.data) {
        console.error("Error fetching document blob", result.error);
        return null;
      }

      return result.data as Blob;
    } catch (error) {
      console.error("Error fetching document blob", error);
      return null;
    }
  };

  deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      const result = await this.httpClient.delete(
        `${DOCUMENT_BASE_URL}/${documentId}`
      );

      if ("error" in result) {
        console.error("Error deleting document", result.error);
        return false;
      }

      return result.statusCode === 204;
    } catch (error) {
      console.error("Error deleting document", error);
      return false;
    }
  };
}

type PetDocumentWithType = PetDocument & {
  type: PetDocumentTypeId;
};

function convertToPetDocuments(data: unknown): PetDocumentWithType[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    Id: z.string(),
    ContentType: z.string(),
    DocumentType: z.number(),
    PetId: z.string(),
    Name: z.string(),
  });

  const documents: PetDocumentWithType[] = [];

  data.forEach((petData) => {
    const petDocument = parseData(serverResponseSchema, petData);

    if (!petDocument) return;

    documents.push({
      downloadPath: petDocument.Id,
      fileName: petDocument.Name,
      // @ts-expect-error - asdfa
      fileType: getFileExtension(petDocument.Name),
      id: petDocument.Id,
      type: getPetRecordDocumentType(petDocument.DocumentType),
    } satisfies PetDocumentWithType);
  });

  return documents;
}

enum PetDocumentRecordType {
  MedicalRecord = 1,
  Vaccine = 2,
  Test = 3,
  Other = 1024,
}

function getPetRecordDocumentType(record?: number): PetDocumentTypeId {
  const documentRecordTypeMap: Record<
    PetDocumentRecordType,
    PetDocumentTypeId
  > = {
    [PetDocumentRecordType.MedicalRecord]: "medical",
    [PetDocumentRecordType.Other]: "other",
    [PetDocumentRecordType.Test]: "tests",
    [PetDocumentRecordType.Vaccine]: "vaccines",
  };

  return documentRecordTypeMap[record as PetDocumentRecordType] || "other";
}
