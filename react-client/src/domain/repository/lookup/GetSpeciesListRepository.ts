import { SpeciesModel } from "~/domain/models/lookup/LookupModel";

export interface GetSpeciesListRepository {
  query(): Promise<SpeciesModel[]>;
}
