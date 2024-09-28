export interface GetCountriesRepository {
  query(): Promise<string[] | []>;
}
