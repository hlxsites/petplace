import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetSpeciesListRepository } from "~/domain/repository/lookup/GetSpeciesListRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetSpeciesListUseCase } from "./GetSpeciesListUseCase";
import { MockGetSpeciesListUseCase } from "./MockGetSpeciesListUseCase";

export default function getSpeciesListUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetSpeciesListRepository {
  if (ENABLE_MOCK) return new MockGetSpeciesListUseCase();

  return new GetSpeciesListUseCase(authToken, httpClient);
}
