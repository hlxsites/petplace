import { BreedModel } from "~/domain/models/lookup/LookupModel";

export interface GetBreedListRepository {
  query(speciesId: number): Promise<BreedModel[]>;
}
