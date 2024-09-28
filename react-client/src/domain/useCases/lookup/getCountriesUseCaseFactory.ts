import { GetCountriesRepository } from "~/domain/repository/lookup/GetCountriesRepository";
import { GetCountriesUseCase } from "./GetCountriesUseCase";

export default function getCountriesUseCaseFactory(): GetCountriesRepository {
  return new GetCountriesUseCase();
}
