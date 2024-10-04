
import { ReportClosingModel } from "~/domain/models/pet/ReportClosingModel";
import { PutReportClosingRepository } from "~/domain/repository/pet/PutReportClosingRepository";

export class MockPutReportClosingUseCase implements PutReportClosingRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutate = async (_props: ReportClosingModel): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };
}
