import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetReportClosingReasonsRepository } from "~/domain/repository/lookup/GetReportClosingReasonsRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { GetReportClosingReasonsUseCase } from "./GetReportClosingReasonsUseCase";
import { MockGetReportClosingReasonsUseCase } from "./MockGetReportClosingReasonsUseCase";

export default function getReportClosingReasonsUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): GetReportClosingReasonsRepository {
  if (ENABLE_MOCK) return new MockGetReportClosingReasonsUseCase();

  return new GetReportClosingReasonsUseCase(authToken, httpClient);
}
