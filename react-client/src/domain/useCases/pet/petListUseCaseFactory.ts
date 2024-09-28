import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetsListRepository } from "~/domain/repository/pet/GetPetsListRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetPetsListUseCase } from "./GetPetsListUseCase";
import { MockGetPetsListUseCase } from "./MockGetPetsListUseCase";

export default function petListUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetPetsListRepository {
  if (ENABLE_MOCK) return new MockGetPetsListUseCase();

  return new GetPetsListUseCase(authToken, httpClient);
}
