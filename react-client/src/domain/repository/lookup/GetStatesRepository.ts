import { CountryStateModel } from "~/domain/models/lockup/CountryStateModel";

export interface GetStatesRepository {
  query(countryId: string): Promise<CountryStateModel[]>;
}
