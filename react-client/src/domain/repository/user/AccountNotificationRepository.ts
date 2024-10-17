import { AccountNotificationPreferencesModel } from "~/domain/models/user/UserModels";

export interface AccountNotificationPreferencesRepository {
  query(): Promise<AccountNotificationPreferencesModel | null>;
  mutate(data: AccountNotificationPreferencesModel): Promise<boolean>;
}
