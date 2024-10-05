import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PutReportClosingRepository } from "~/domain/repository/pet/PutReportClosingRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { MockPutReportClosingUseCase } from "./MockPutReportClosingUseCase";
import { PutReportClosingUseCase } from "./PutReportClosingUseCase";

export default function putReportClosingUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): PutReportClosingRepository {
  if (ENABLE_MOCK) return new MockPutReportClosingUseCase();

  return new PutReportClosingUseCase(authToken, httpClient);
}
