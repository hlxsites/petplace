import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { GetReportClosingReasonsRepository } from "../../repository/lookup/GetReportClosingReasonsRepository";

export class MockGetReportClosingReasonsUseCase
  implements GetReportClosingReasonsRepository
{
  query = async (): Promise<ReportClosingReasonModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: 4,
        reason: "I picked up my pet from the shelter/finder",
      },
      {
        id: 2,
        reason: "I found my pet myself",
      },
      {
        id: 11,
        reason: "I surrendered my pet",
      },
      {
        id: 1,
        reason: "My pet was never lost",
      },
      {
        id: 18,
        reason: "I do not own this pet",
      },
      {
        id: 3,
        reason: "This pet is deceased",
      },
    ];
  };
}
