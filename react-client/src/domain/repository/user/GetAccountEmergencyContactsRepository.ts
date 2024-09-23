import { AccountEmergencyContactModel } from "../../models/user/UserModels";

export interface GetAccountEmergencyContactsRepository {
  query(): Promise<AccountEmergencyContactModel[] | []>;
}
