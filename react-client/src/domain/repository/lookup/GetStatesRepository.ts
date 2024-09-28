export interface GetStatesRepository {
  query(country: string): Promise<string[] | []>;
}
