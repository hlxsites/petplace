import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { GetPetDocumentsRepository } from "~/domain/repository/pet/GetPetDocumentsRepository";
import { PetRecord } from "~/domain/models/pet/PetRecords";
import { getPetRecordDocumentType } from "~/util/getPetRecordDocumentType";
import { getFileExtension } from "~/util/stringUtil";

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

  async query(petId: string): Promise<PetRecord[]> {
    try {
      const result = await this.httpClient.get(`Pet/${petId}/documents`);

      if (result.data) return convertToPetDocuments(result.data);

      return [];
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
