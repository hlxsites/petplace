import { AccountNotificationsModel } from "../../models/user/UserModels";

export interface AccountNotificationRepository {
  query(): Promise<AccountNotificationsModel | null>;
  mutate(data: AccountNotificationsModel): Promise<boolean>;
}
