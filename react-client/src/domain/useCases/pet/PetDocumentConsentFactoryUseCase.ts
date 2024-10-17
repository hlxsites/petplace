import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetDocumentConsentRepository } from "~/domain/repository/pet/PetDocumentConsentRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { PetDocumentConsentMockUseCase } from "./PetDocumentConsentMockUseCase";
import { PetDocumentConsentUseCase } from "./PetDocumentConsentUseCase";

export default function PetDocumentConsentFactoryUseCase(
  authToken: string,
  httpClient?: HttpClientRepository
): PetDocumentConsentRepository {
  if (ENABLE_MOCK) return new PetDocumentConsentMockUseCase();

  return new PetDocumentConsentUseCase(authToken, httpClient);
}
