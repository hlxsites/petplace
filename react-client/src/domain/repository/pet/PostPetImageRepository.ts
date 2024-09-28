export type MutationProps = {
  petId: string;
  petImage: File;
};

export interface PostPetImageRepository {
  mutate(props: MutationProps): Promise<boolean | null>;
}
