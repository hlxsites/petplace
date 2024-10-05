import { ReportPetFoundMutationInput } from "~/domain/models/pet/ReportClosingModel";

export interface PutReportClosingRepository {
  mutate(props: ReportPetFoundMutationInput): Promise<boolean>;
}
