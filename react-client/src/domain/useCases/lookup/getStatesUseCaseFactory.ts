import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetStatesRepository } from "~/domain/repository/lookup/GetStatesRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetStatesUseCase } from "./GetStatesUseCase";
import { MockGetStatesUseCase } from "./MockGetStatesUseCase";

export default function GetStatesUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetStatesRepository {
  if (ENABLE_MOCK) return new MockGetStatesUseCase();

  return new GetStatesUseCase(authToken, httpClient);
}
