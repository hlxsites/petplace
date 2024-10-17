import { AccountDetailsModel } from "~/domain/models/user/UserModels";

export interface AccountDetailsRepository {
  mutate(data: AccountDetailsModel): Promise<boolean>;
  query(): Promise<AccountDetailsModel | null>;
}
