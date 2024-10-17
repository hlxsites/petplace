import { PutReportClosingRepository } from "~/domain/repository/pet/PutReportClosingRepository";

export class MockPutReportClosingUseCase implements PutReportClosingRepository {
  mutate = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
