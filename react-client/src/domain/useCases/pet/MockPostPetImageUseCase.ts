import { PetImageMutationInput } from "~/domain/models/pet/PetImage";
import { PostPetImageRepository } from "~/domain/repository/pet/PostPetImageRepository";

export class MockPostPetImageUseCase implements PostPetImageRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutate = async (_props: PetImageMutationInput): Promise<boolean | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
