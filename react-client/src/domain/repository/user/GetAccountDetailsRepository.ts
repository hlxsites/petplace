import { AccountDetailsModel } from "../../models/user/UserModels";

export interface GetAccountDetailsRepository {
  query(): Promise<AccountDetailsModel | null>;
}
