import { PetImageMutationInput } from "~/domain/models/pet/PetImage";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostPetImageRepository } from "~/domain/repository/pet/PostPetImageRepository";
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

  private handleError = (error: unknown): null => {
    console.error("PostPetImageUseCase query error", error);
    return null;
  };

  mutate = async ({
    petId,
    petImage,
  }: PetImageMutationInput): Promise<boolean | null> => {
    const formData = new FormData();
    formData.append("file", petImage);

    try {
      const result = await this.httpClient.postFormData(
        `/api/Pet/${petId}/image`,
        {
          body: formData,
        }
      );

      if (result.data) return result.data as boolean;

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  };
}
