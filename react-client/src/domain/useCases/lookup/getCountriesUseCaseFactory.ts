import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetCountriesRepository } from "~/domain/repository/lookup/GetCountriesRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetCountriesUseCase } from "./GetCountriesUseCase";
import { MockGetCountriesUseCase } from "./MockGetCountriesUseCase";

export default function getCountriesUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetCountriesRepository {
  if (ENABLE_MOCK) return new MockGetCountriesUseCase();

  return new GetCountriesUseCase(authToken, httpClient);
}
