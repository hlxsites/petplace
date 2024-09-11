import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetsListRepository } from "~/domain/repository/pet/GetPetsListRepository";
import { IS_DEV_ENV } from "~/util/envUtil";
import { GetPetsListUseCase } from "./GetPetsListUseCase";
import { MockGetPetsListUseCase } from "./MockGetPetsListUseCase";

export default function (
  authToken: string,
  httpClient?: HttpClientRepository
): GetPetsListRepository {
  if (IS_DEV_ENV) return new MockGetPetsListUseCase();

  return new GetPetsListUseCase(authToken, httpClient);
}
