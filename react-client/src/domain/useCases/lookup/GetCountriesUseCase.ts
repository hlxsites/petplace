import { CountryModel } from "~/domain/models/lockup/CountryModel";
import { GetCountriesRepository } from "../../repository/lookup/GetCountriesRepository";

export class GetCountriesUseCase implements GetCountriesRepository {
  query = (): CountryModel[] => {
    return [
      {
        id: "CA",
        title: "CANADA",
      },
      {
        id: "US",
        title: "United States",
      },
    ];
  };
}
