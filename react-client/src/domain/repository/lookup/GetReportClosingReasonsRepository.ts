import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";

export interface GetReportClosingReasonsRepository {
  query(): Promise<ReportClosingReasonModel[]>;
}
