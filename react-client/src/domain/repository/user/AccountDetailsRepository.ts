import { AccountDetailsModel } from "../../models/user/UserModels";

export interface AccountDetailsRepository {
  query(): Promise<AccountDetailsModel | null>;
  mutate(data: AccountDetailsModel): Promise<boolean>;
}
