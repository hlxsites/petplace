import { AccountNotificationModel } from "../../models/user/UserModels";

export interface GetAccountNotificationRepository {
  query(): Promise<AccountNotificationModel | null>;
}
