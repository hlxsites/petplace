import { PetImageMutationInput } from "~/domain/models/pet/PetImage";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostPetImageRepository } from "~/domain/repository/pet/PostPetImageRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class PostPetImageUseCase implements PostPetImageRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  mutate = async ({
    petId,
    petImage,
  }: PetImageMutationInput): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", petImage);

    try {
      const result = await this.httpClient.postFormData(
        `/api/Pet/${petId}/image`,
        {
          body: formData,
        }
      );
      return !!result.success;
    } catch (error) {
      logError("PostPetImageUseCase query error", error);
    }
    return false;
  };
}
