import { ReportClosingModel } from "~/domain/models/pet/ReportClosingModel";

export interface PutReportClosingRepository {
  mutate(props: ReportClosingModel): Promise<boolean>;
}
