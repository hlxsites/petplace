import { SpeciesModel } from "../../models/lookup/LookupModel";

export interface GetSpeciesListRepository {
  query(): Promise<SpeciesModel[]>;
}
