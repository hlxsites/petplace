import { CountryModel } from "~/domain/models/lookup/CountryModel";

export interface GetCountriesRepository {
  query(): CountryModel[];
}
