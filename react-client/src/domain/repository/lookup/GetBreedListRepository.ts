import { BreedModel } from "~/domain/models/lookup/LookupModel";

export interface GetBreedListRepository {
  query(): Promise<BreedModel[]>;
}
