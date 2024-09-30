import { PetImageMutationInput } from "~/domain/models/pet/PetImage";

export interface PostPetImageRepository {
  mutate(props: PetImageMutationInput): Promise<boolean | null>;
}
