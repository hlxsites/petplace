import { BreedModel } from "../../models/lookup/LookupModel";

export interface GetBreedListRepository {
  query(): Promise<BreedModel[]>;
}
