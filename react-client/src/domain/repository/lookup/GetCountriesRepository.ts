import { CountryModel } from "~/domain/models/lockup/CountryModel";

export interface GetCountriesRepository {
  query(): CountryModel[];
}
