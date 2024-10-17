import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";

export interface AccountEmergencyContactsRepository {
  query(): Promise<AccountEmergencyContactModel[]>;
  mutate(data: AccountEmergencyContactModel[]): Promise<boolean>;
  delete(data: AccountEmergencyContactModel): Promise<boolean>;
}
