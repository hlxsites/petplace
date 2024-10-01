import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetBreedListRepository } from "~/domain/repository/lookup/GetBreedListRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetBreedListUseCase } from "./GetBreedListUseCase";
import { MockGetBreedListUseCase } from "./MockGetBreedListUseCase";

export default function getBreedListUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetBreedListRepository {
  if (ENABLE_MOCK) return new MockGetBreedListUseCase();

  return new GetBreedListUseCase(authToken, httpClient);
}
