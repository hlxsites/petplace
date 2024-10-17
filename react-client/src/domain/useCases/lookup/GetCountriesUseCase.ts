import { CountryModel } from "~/domain/models/lookup/CountryModel";
import { GetCountriesRepository } from "~/domain/repository/lookup/GetCountriesRepository";

export class GetCountriesUseCase implements GetCountriesRepository {
  query = (): CountryModel[] => {
    return [
      {
        id: "CA",
        title: "Canada",
      },
      {
        id: "US",
        title: "United States",
      },
    ];
  };
}
