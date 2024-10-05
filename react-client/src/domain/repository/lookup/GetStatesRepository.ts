import { CountryStateModel } from "~/domain/models/lookup/CountryStateModel";

export interface GetStatesRepository {
  query(countryId: string): Promise<CountryStateModel[]>;
}
